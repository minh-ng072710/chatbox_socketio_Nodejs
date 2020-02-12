const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    Token: String,
    Active: Boolean
});

module.exports = mongoose.model("Token", tokenSchema)