import mongoose from "mongoose";
import DATABASE_URL from "./core/settings.js";

const connectDB = async () => {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log(`Database connected at URL ${DATABASE_URL}`);
    } catch (error) {
        console.error(error);
    }
}

export {connectDB};