const jwt = require("jsonwebtoken");

const verify = (token) => {
  if (typeof token != "string") return false;
  if (token.indexOf("Bearer ") == -1) return false;
  token = token.split("Bearer ")[1];
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error(error.message);
    return false;
  }
  if (decoded.error != undefined) return false;
  return decoded;
}

const authorization = function (req, res, next) {

  var authData = verify(req.headers.authorization);
  if (authData == false) {
    res.status(401).send("Not authorized or wrong token given");
    return false;
  }
  res.locals.auth = authData;
  next();
}

module.exports = {authorization, verify};
