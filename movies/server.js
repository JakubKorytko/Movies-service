require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const {authorization} = require("./verify");
const OMDB = require('./omdb');
var Database = require("./database");
var db = new Database();
require("./task-data");

const PORT = process.env.MOVIES_PORT;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET env var. Set it and restart the server");
}
if (!PORT) {
  throw new Error("Missing MOVIES_PORT env var. Set it and restart the server");
}

const app = express();

app.use(bodyParser.json());

//get first and last day of current month (Date objects)
function monthLimits() {

  var date = new Date();
  var userTimezoneOffset = new Date().getTimezoneOffset() * 60000;


  var bottom = new Date(date.getFullYear(), date.getMonth(),1);
  bottom = new Date(bottom.getTime() - userTimezoneOffset)
  bottom = bottom.toISOString().slice(0, 19).replace('T', ' ');

  var upper = new Date(date.getFullYear(), date.getMonth() + 1,0, 23,59,59);
  upper = new Date(upper.getTime() - userTimezoneOffset)
  upper = upper.toISOString().slice(0, 19).replace('T', ' ');

  return [bottom, upper]
}

app.post("/movies", authorization, async (req, res) => {

  var authData = res.locals.auth;
  var limits = monthLimits();
  const LIMIT = 5;

  var result = await db.query(
    `SELECT COUNT(*) AS CREATED FROM movies WHERE creatorID = ${authData.userId} AND created > "${limits[0]}" AND created < "${limits[1]}";`,
  1)

  if (result[0]["CREATED"] >= LIMIT && authData.role == "basic") {
    res.status(429).send("Basic users can create up to 5 movies per month");
    return false;
  }

  var movie = {
    ...await OMDB.get(req.body.title),
    created: new Date().toISOString().slice(0, 19).replace('T', ' '),
    creatorID: authData.userId
  }

  db.insert("movies", movie)

  res.send("Movie added");
})

app.get("/movies", authorization, async (req, res) => {
  res.send(
    await db.query(`SELECT * FROM movies WHERE creatorID = ${res.locals.auth.userId};`, 1)
  );
})

app.use((error, _, res, __) => {
  console.error(
    `Error processing request ${error}. See next message for details`
  );
  console.error(error);

  return res.status(500).json({ error: "internal server error" });
});

app.listen(PORT, () => {
  console.log(`movies services running at port ${PORT}`);
});
