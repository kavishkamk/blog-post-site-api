const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String, required: [true, "first Name required"] },
    lastName: { type: String, required: [true, "Last Name required"] },
    email: { type: String, required: [true, "email required"], unique: true },
    password: { type: String, required: [true, "password required"], minLength: [6, "passwrod length should > 6"] },
    image: { type: String, required: [true, "image required"] }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);