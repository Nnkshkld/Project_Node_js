import mongoose from "mongoose";


const usersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    age: {
        type: Number,
        min: [18, "Users must be adults"],
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        min: [8, "Password must be at least 8 characters long"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default usersSchema;