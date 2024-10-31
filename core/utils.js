import {JWT_SECRET} from "./settings.js";
import {JWToken} from "../models/tokenModel.js";

import jwt from 'jsonwebtoken';

const generateToken = async (user) => {
    const token = jwt.sign({
        _id: user._id,
        email: user.email
    }, JWT_SECRET, {expiresIn: "3d"});

    const tokenEntry = new JWToken({token, userEmail: user.email});
    await tokenEntry.save();

    return token;
};

const invalidateToken = async (token) => {
    await JWToken.deleteOne({token});
};

export {generateToken, invalidateToken};