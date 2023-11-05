const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    author: {
        type: String,
        required: true
    },
    edition: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const book = mongoose.model("book", bookSchema);
module.exports = book;