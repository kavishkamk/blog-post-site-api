const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: { type: String, required: [true, "title required"] },
    content: { type: String, required: [true, "content required"] },
    image: { type: String, required: [true, "image required"] },
    creator: { type: mongoose.Types.ObjectId, required: [true, "creator required"], ref: "User" }
});

module.exports = mongoose.model("Blog", blogSchema);