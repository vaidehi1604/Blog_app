const express = require("express");
const router = express();
const publicController = require("../controller/public");

//get all blog post in order latest new
router.get("/", publicController.allPostOrderBy);

//search by name
router.get("/:name", publicController.getPostByName);

//get all we can search

router.get("/search/:key", publicController.getPostSearch);

//get one blog post by ID

router.get("/:postId", publicController.getPostById);

//get post by category

router.get("/cat/:categoryId", publicController.getCategoryByPost);

module.exports = router;
