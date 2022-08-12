const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //check 1:  see if this exists in the header
  const authHeader = req.get("Authorization");

  //   if it doesn't set to false and escape middleware
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  //   otherwise split at the first blank space after 'Bearer' and take token
  const token = authHeader.split(" ")[1];
  console.log(token);

  // check 2: if there is no token or it is an empty string got to next
  if (!token || token === "") {
    this.req.isAuth = false;
    return next();
  }
  //  if there is a token, verify if token has the same 'secretkey' and store as 'decodedToken'
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secretkey");
  } catch (error) {
    // but if secretKeys don't match, go escape middleware
    req.isAuth = false;
    return next();
  }
  //  check 3: if decodedToken has failed to be set, escape middleware
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  //   if all checks pass then set isAuth to true and get userId
  req.isAuth = true;
  req.userId = decodedToken.userId;
};
