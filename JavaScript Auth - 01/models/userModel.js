import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Must provide a username"],
        unique: [true, "Username must be unique"],
    },
    usermail: {
        type: String,
        required: [true, "Must provide an email"],
        unique: [true, "Email must be unique"],
    },
    userpassword: {
        type: String,
        required: [true, "Must provide a password"],
    },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
