const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, 
    required: true ,
    match:/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/
  },
});
module.exports = mongoose.model("category", categorySchema);
