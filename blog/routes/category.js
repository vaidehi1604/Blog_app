const express = require("express");
const router = express();
const checkAuth = require("../middleware/check-auth");
const categoryController = require("../controller/category");

//get all category

router.get("/", checkAuth, categoryController.getAllCategory);

//add category

router.post("/", checkAuth,categoryController.addCategory);

//update category

router.patch("/:categoryId",checkAuth, categoryController.updateCategory);

//delete category

router.delete("/:categoryId", checkAuth,categoryController.deleteCategory);

module.exports = router;
