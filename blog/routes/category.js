const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express();
const checkAuth = require("../middleware/check-auth");
const product = require("../models/category");

//get all category
router.get("/", (req, res, next) => {
  product
    .find()
    .select("name  _id ")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            _id: doc._id,
            requesr: {
              type: "GET",
              url: "http://localhost:3000/category/" + doc._id,
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
});

//add category

router.post("/", checkAuth,(req, res, next) => {
  console.log(req.file);
  const Product = new product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
  });
  Product.save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "handling post request",
        createdproduct: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//update category or edit

router.patch("/:productID", checkAuth,(req, res, next) => {
  const id = req.params.productID;
  const updateOps = {};
  console.log(req.body);
  product
    .update({ _id: id }, { $set: req.body })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/category/" + id,
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

//delete category
router.delete("/:productID",checkAuth, (req, res, next) => {
  const id = req.params.productID;
  product
    .remove({ _id: id })
    .exec()
    .then((result) => {
      // console.log(result)
      res.status(200).json({
        message: "product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/category/" + id,
          body: { name: "String", price: "Number" },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
