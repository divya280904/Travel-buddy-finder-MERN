const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter a username"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"]
    },
    userID: {
        type: Number
    }
},
{
    // tracks when data is added/modified in the DB
    timestamps: true
}
);

const User = mongoose.model("User", userSchema);
module.exports = User;