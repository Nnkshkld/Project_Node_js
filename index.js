import express from "express";

import UsersRouter from "./routes/users.js";
import OrdersRouter from "./routes/orders.js"
import {DATABASE_URL, PORT, server} from "./core/settings.js";
import mongoose from "mongoose";


server.use(express.json());
server.use("/users", UsersRouter);

server.use(express.json());
server.use("/orders", OrdersRouter);

server.listen(PORT, async () => {
    console.log(`Server listens on port ${PORT}`);
    try {
        await mongoose.connect(DATABASE_URL);
        console.log(`Database connected at URL ${DATABASE_URL}`);
    } catch (error) {
        console.error(error);
    }
})
