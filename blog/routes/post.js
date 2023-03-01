const express = require("express");
const router = express();
const checkAuth = require("../middleware/check-auth");
const postController = require("../controller/post");

//Get all post

router.get("/", checkAuth, postController.getAllPost);

//Add post

router.post("/", checkAuth, postController.addPost);

//Edit blog post using Id

router.patch("/:postId", checkAuth, postController.updatePost);

//Delete blog post using Id

router.delete("/:postId", checkAuth, postController.deletePost);

module.exports = router;
