const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        required: false,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
