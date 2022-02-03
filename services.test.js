require('dotenv').config();
const { authFactory } = require('./auth/auth');
const Database = require('./movies/database');
const OMDB = require("./movies/omdb");
const Users = require('./movies/users');
const { verify } = require('./movies/verify');
var db = new Database();

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

test('omdb fetch works', async () => {
    var ans = await OMDB.get("spiderman");
    expect(ans.Director).toBe("Christian Davi")
})

test('database works', async () => {
    var rnd = rand(1,500)
    var insert = await db.insert("test", {id: rnd, data:"test"})
    var select = await db.query(`SELECT data FROM test WHERE id=${rnd}`, 1);
    var remove = await db.query(`DELETE FROM test WHERE id=${rnd}`);
    var result = insert.changes == 1 && select[0]["data"] == "test" && remove.changes == 1
    expect(result).toBe(true);
})

test('verification works', async () => {
    var token = authFactory(process.env.JWT_SECRET)("basic-thomas","sR-_pcoow-27-6PAwCD8");
    var result = verify(token);
    expect(result.name).toBe("Basic Thomas");
})

test('adding user to database works', async () => {
    var add = await Users.add("test", "test", "test", "test");
    var remove = await db.query(`DELETE FROM users WHERE id=${add.lastInsertRowid}`);
    var result = add.changes==1 && remove.changes == 1
    expect(result).toBe(true);
})