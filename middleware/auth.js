import {JWT_SECRET} from "../core/settings.js";
import {JWToken} from "../models/tokenModel.js";

import jwt from "jsonwebtoken"

const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({message: 'Access Denied'});

    try {
        const verified = jwt.verify(token, JWT_SECRET);

        const tokenInWhiteList = await JWToken.findOne({token});
        if (!tokenInWhiteList) {
            return res.status(403).json({message: "Invalid token"});
        }

        req.user = verified;
        next();
    } catch (error) {
        console.log(error)
        return res.status(400).json({message: "Invalid token"});
    }
}

export default authMiddleware;