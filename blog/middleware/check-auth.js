const jwt = require("jsonwebtoken");
const user = require("../models/user");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decode = jwt.verify(token, process.env.JWT_KEY);

    req.userData = decode;
    console.log(decode);

    user
      .findById(decode.userId)
      .then((userData) => {
        console.log(userData);
        if (token != userData.token) {
          console.log("token not match");
          return res.status(401).json({ message: "Authentication fail" });
        }
        req.userData = decode;
        next();
      })
      .catch((err) => {
        res.status(200).json({
          error: err,
        });
      });
  } catch (error) {
    return res.status(401).json({
      message: "auth failed",
    });
  }
};
