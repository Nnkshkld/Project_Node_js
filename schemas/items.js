import mongoose from "mongoose";
import {ItemAvailability} from "../core/constants.js";

const ItemSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId
    },
    name: {
        type: String,
        required: true,
        maxLength: 125,
        min: [10, "The name length cannot be less than 10 chars"],
        max: [125, "The name length cannot be more than 125 chars"]
    },
    description: {
        type: String,
        required: true,
        min: [10, "The description length cannot be less than 10 chars"]
    },
    availabilityStatus: {
        type: String,
        enum: [ItemAvailability.AVAILABLE, ItemAvailability.NOT_AVAILABLE],
        default: ItemAvailability.AVAILABLE,
    },
    price: {
        type: Number,
        required: true
    }
});

export default ItemSchema;