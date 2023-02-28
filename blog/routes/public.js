const express = require("express");
const router = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth");

const Category = require("../models/category");
const posts = require("../models/post");

//get all blog post in order latest new
router.get("/", (req, res, next) => {
  //sort by date
  posts
    .find()
    .sort({ publishdate: -1 })
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
              url: "http://localhost:3000/public/",
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

//search by name

router.get("/:name", (req, res, next) => {
  posts.find(
    {
      title: req.params.name,
    },
    function (err, posts) {
      if (err) {
        err.status = 406;
        return next(err);
      }
      console.log(posts);
      return res.status(201).json({
        message: " success.",
        posts: posts,
      });
    }
  );
});

//get all we can search

router.get("/search/:key", (req, res, next) => {
  console.log(req.params.key);
  const regex = new RegExp(req.params.key, "i");
  posts
    .find({
      description: { $regex: regex },
    })
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        Posts: docs,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//get one blog post by ID

router.get("/:postId", (req, res, next) => {
  posts
    .findById(req.params.postId)
    .then((posts) => {
      if (!posts) {
        return res.status(404).json({
          message: "blog post not found",
        });
      }

      res.status(200).json({
        posts: posts,
        request: {
          type: "GET",
          url: "http://localhost:3000/public/",
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

//get post by category

router.get("/cat/:categoryId", (req, res, next) => {
  posts.find(
    {
      category: req.params.categoryId,
    },
    function (err, posts) {
      if (err) {
        err.status = 406;
        return next(err);
      }
      console.log(posts);
      return res.status(201).json({
        count: posts.length,
        message: " success.",
        posts: posts,
      });
    }
  );
});

module.exports = router;
