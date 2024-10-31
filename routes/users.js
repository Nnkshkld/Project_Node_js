import express from 'express';

import Users from "../models/userModel.js";
import {checkTokenCount, generateToken} from "../core/utils.js";

const router = express.Router();

router.post('/signup', async (req, res) => {
    if (!req.body) {
        return res.status(400).send("No body provided");
    }
    const {firstName, lastName, age, email, password} = req?.body;

    if (!email || !password) {
        return res.status(400).send('Fill required fields');
    }

    if (password.length < 8) {
        return res.status(400).send('Password is too short');
    }

    try {
        const existingUser = await Users.findOne({email});
        if (existingUser) {
            return res.status(409).send('User with this email already exists');
        }

        const newUser = await Users.create({firstName, lastName, age, email, password});
        if (newUser) {
            return res.status(201).send("Successfully created");
        } else {
            return res.status(400).send("Invalid data set provided")
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req?.body;

    if (!email || !password) {
        return res.status(400).send('No credentials provided');
    }

    try {
        const existingUser = await Users.findOne({email, password});
        if (!existingUser) {
            return res.status(401).send('Invalid credentials');
        }

        const token = await generateToken(existingUser)
        await checkTokenCount(req);

        return res.status(200).send(token);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});
export default router;