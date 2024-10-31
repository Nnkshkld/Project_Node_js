import mongoose from "mongoose";

const JWTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: "3d"
    }
})

export default JWTokenSchema;