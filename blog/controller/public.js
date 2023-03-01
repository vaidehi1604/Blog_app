const posts = require("../models/post");
const mongoose = require("mongoose");

//all blog post latest first
exports.allPostOrderBy = (req, res, next) => {
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
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

//get post by name
exports.getPostByName = (req, res, next) => {
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
};

//get post by name

exports.getPostSearch = (req, res, next) => {
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
};

//get post by Id
exports.getPostById = (req, res, next) => {
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
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

//search by category
exports.getCategoryByPost = (req, res, next) => {
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
};
