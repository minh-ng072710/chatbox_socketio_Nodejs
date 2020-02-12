const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    Boss        :   mongoose.Types.ObjectId,
    Message     :   String,
    Sen         :   mongoose.Types.ObjectId,
    View        :   Boolean,
    Time        :   Date
});

module.exports = mongoose.model("MessageChat", messageSchema)