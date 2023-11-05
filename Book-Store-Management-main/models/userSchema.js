const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        }, 
        cart: [
            {
                 type: mongoose.Schema.Types.ObjectId, ref: 'book' 
            },
        ]   

});

const users = mongoose.model('user', userSchema);
module.exports = users;