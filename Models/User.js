const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    Username: String,
    Email: String,
    Password: String,
    Avatar: String,
    Active: Boolean,
    RandomActive: String,
    Group: Number
});

module.exports = mongoose.model("User", userSchema)