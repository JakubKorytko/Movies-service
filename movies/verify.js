const jwt = require("jsonwebtoken");

const verify = (token) => {
  if (typeof token != "string") return false;
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

  var token = req.headers.authorization
  
  if (token.indexOf("Bearer ") == -1) {
    res.status(401).send("Bearer missing");
    return false;
  }

  token = token.split("Bearer ")[1];
  var authData = verify(token);
  if (authData == false) {
    res.status(401).send("Not authorized or wrong token given");
    return false;
  }
  res.locals.auth = authData;
  next();
}

module.exports = {authorization, verify};
