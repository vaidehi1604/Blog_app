const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const postSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  //form:categoryId=""
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
    required: true,
  },
  title: {
    type: String,
    required: true,
    match: /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/,
  },
  description: { type: String, required: true },
  //date:MM/DD/YY
  publishDate: { type: Date, required: true },
  author: {
    type: String,
    required: true,
    match: /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/,
  },
  slug: { type: String, slug: "title" },
});
module.exports = mongoose.model("Post", postSchema);
