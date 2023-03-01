const express = require("express");
const router = express();
const checkAuth = require("../middleware/check-auth");
const userController = require("../controller/user");

//User Signup
router.post("/signup", userController.userSignup);

//Login route

router.post("/login", userController.userLogin);

//delete user data
router.delete("/:userId",checkAuth, userController.userDelete);

// user logout
router.post("/logout",checkAuth, userController.userLogout);

module.exports = router;
