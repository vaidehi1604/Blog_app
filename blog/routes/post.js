const express = require("express");
const router = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth");
const Category = require("../models/category");
const posts = require("../models/post");

//add post
router.post("/", checkAuth,(req, res, next) => {
  Category.findById(req.body.categoryId)
    .then((Category) => {
      if (!Category) {
        return res.status(404).json({
          message: "category not found!!!!",
        });
      }
      const Posts = new posts({
        _id: mongoose.Types.ObjectId(),
        category: req.body.categoryId,
        title: req.body.title,
        description: req.body.description,
        publishdate: req.body.publishdate,
        author: req.body.author,
      });
      return Posts.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "order stored",
        createdpost: {
          _id: result._id,
          category: result.category,
          title: result.title,
          description: result.description,
          publishdate: result.publishdate,
          author: result.author,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/post/" + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//get all post

router.get("/", checkAuth,(req, res, next) => {
  posts
    .find()
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        Posts: docs.map((doc) => {
          return {
            _id: doc._id,
            category: doc.category,
            title: doc.title,
            description: doc.description,
            publishdate: doc.publishdate,
            author: doc.author,
            request: {
              type: "GET",
              url: "http://localhost:3000/post/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//edit blog post using Id
router.patch("/:postId", checkAuth,(req, res, next) => {
  const id = req.params.postId;
  console.log(req.body);
  posts
    .update({ _id: id }, { $set: req.body })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Blog post updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/post/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//Delete all post

router.delete("/:postId", checkAuth,(req, res, next) => {
  posts
    .remove({ _id: req.params.postId })
    .exec()
    .then((Posts) => {
      res.status(200).json({
        message: "blog post  deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/post/",
        },
      });
    })
    .catch();
});

module.exports = router;
