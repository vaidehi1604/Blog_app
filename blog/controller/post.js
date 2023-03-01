const Category = require("../models/category");
const Post = require("../models/post");
const mongoose = require("mongoose");


//add post
exports.addPost=(req, res, next) => {
    Category.findById(req.body.categoryId)
      .then((Category) => {
        if (!Category) {
          return res.status(404).json({
            message: "category not found!!!!",
          });
        }
        const Posts = new Post({
          _id: mongoose.Types.ObjectId(),
          category: req.body.categoryId,
          title: req.body.title,
          description: req.body.description,
          publishDate: req.body.publishDate,
          author: req.body.author,
        });
        return Posts.save();
      })
      .then((result) => {
        console.log(result);
        res.status(201).json({
          message: "blog post created",
          postCreated: {
            _id: result._id,
            category: result.category,
            title: result.title,
            description: result.description,
            publishDate: result.publishDate,
            author: result.author,
          },
          
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }

  //get all post
exports.getAllPost=(req, res, next) => {
    Post
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
              publishDate: doc.publishDate,
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
  }
//update post

  exports.updatePost=(req, res, next) => {
    const id = req.params.postId;
    console.log(req.body);
    Post
      .updateOne({ _id: id }, { $set: req.body })
      .exec()
      .then((result) => {
        console.log(result);
        res.status(200).json({
          message: "Blog post updated",
         
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }
//delete post
  exports.deletePost=(req, res, next) => {
    Post
      .remove({ _id: req.params.postId })
      .exec()
      .then((Posts) => {
        res.status(200).json({
          message: "blog post  deleted",
          
        });
      })
      .catch();
  }