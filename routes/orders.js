import express from "express";

import authMiddleware from "../middleware/auth.js";
import Orders from "../models/orderModel.js";

const router = express.Router();

router.post("/create", authMiddleware, async (req, res) => {
    try {
        const order = new Orders({
            userId: req.user._id,
            items: req.body.items,
            total: req.body.total,
            amount: req.body.amount
        });
        await order.save();
        return res.status(201).json(order);
    } catch (error) {
        return res.status(400).json({message: 'Error creating order'});
    }
});

router.patch("/edit-order", authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const {id} = req.body;

        const order = await Orders.findOne({_id: id, userId: userId});
        if (!order) {
            return res.status(404).json({message: "Order not found"});
        }
        if (req.body.items) order.items = req.body.items;
        if (req.body.total) order.total = req.body.total;
        if (req.body.amount) order.amount = req.body.amount;

        await order.save();

        return res.status(200).json(order);

    } catch (error) {
        return res.status(400).json({message: "Error updating order"});
    }
});

router.delete("/cancel-order", authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const {id} = req.body;

        const order = await Orders.findOne({_id: id, userId: userId});
        if (!order) {
            return res.status(404).json({message: "Order not found"});
        }

        await order.deleteOne();
        return res.status(204).json({message: "Order successfully deleted"});

    } catch (error) {
        return res.status(400).json({message: "Error deleting order"});
    }
});

router.get("/find-order/:id", async (req, res) => {
    const {id} = req.params;

    try {
        const order = await Orders.findOne({_id: id});
        if (!order) {
            return res.status(404).json({message: "Order not found"});
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({message: "Error retrieving order"});
    }
});

router.get("/get-all-orders", authMiddleware, async (req, res) => {
    try {
        const orders = await Orders.find({});

        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({message: "Error retrieving orders"});
    }
});

router.get("/get-all-user-orders/:userId", async (req, res) => {
    const {userId} = req.params

    try {
        const orders = await Orders.find({userId: userId});

        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({message: "Error retrieving orders"});
    }

});
export default router;