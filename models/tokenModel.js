import mongoose from "mongoose";
import JWTokenSchema from "../schemas/tokens.js";
import {Collections} from "../core/constants.js";

const JWToken = mongoose.model(Collections.JWT_WHITELIST, JWTokenSchema);

export {JWToken};