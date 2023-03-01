const user = require("../models/user");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.userSignup = (req, res) => {
  user
    .find({ email: req.body.email })
    .exec()
    .then((User) => {
      if (User.length >= 1) {
        //conflict -409
        return res.status(409).json({
          message: "Email already exists",
        });
      }
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          const User = new user({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
            token: " ",
          });
          User.save()
            .then((result) => {
              res.status(201).json({
                message: "User created",
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: err,
              });
            });
        }
      });
    });
};
//login user
exports.userLogin = (req, res, next) => {
  user
    .find({ email: req.body.email })
    .exec()
    .then((User) => {
      if (User.length < 1) {
        return res.status(401).json({
          message: "authentication fail",
        });
      }
      bcrypt.compare(req.body.password, User[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "authentication fail",
          });
        }
        if (result) {
          let token = jwt.sign(
            {
              email: User[0].email,
              userId: User[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          user
            .updateOne({ _id: User[0]._id }, { token: token })
            .exec()
            .then((result) => {
              console.log(result);
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: err,
              });
            });

          return res.status(200).json({
            message: "login successful",
            token: token,
          });
        }

        res.status(401).json({
          message: "authentication fail",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
//user delete
exports.userDelete = (req, res, next) => {
  user
    .remove({ _id: req.params.userId })
    .exec()
    .then((ressult) => {
      res.status(200).json({
        message: "user deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
//user logout
exports.userLogout = (req, res) => {
  const Id = req.userData.userId;
  console.log(Id);

  user
    .findById(Id)
    .then((user) => {
      user.token = " ";
      user
        .save()
        .then((result) => {
          res.status(200).json({ message: "User logged out successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
