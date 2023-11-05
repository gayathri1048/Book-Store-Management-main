const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
    bookId: {
        type: Number, 
        required: true
    }, 
    quantity: {
        type: Number,
        required: true
    }
});

const cart = mongoose.model("cart", cartSchema);
module.exports = cart;