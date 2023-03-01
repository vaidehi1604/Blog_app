const Category = require("../models/category");
const { default: mongoose } = require("mongoose");

exports.getAllCategory = (req, res, next) => {
  Category.find()
    .select("name  _id ")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        category: docs.map((doc) => {
          return {
            name: doc.name,
            _id: doc._id,
            request: {
              type: "GET",
            },
          };
        }),
      };

      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.addCategory = (req, res, next) => {
  console.log(req.file);
  const category = new Category({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
  });
  category
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        category_Created: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.updateCategory = (req, res, next) => {
  const id = req.params.categoryId;
  // const updateOps = {};
  console.log(req.body);
  Category.updateOne({ _id: id }, { $set: req.body })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Category Updated",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.deleteCategory = (req, res, next) => {
  const id = req.params.categoryId;
  Category.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Category Deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
