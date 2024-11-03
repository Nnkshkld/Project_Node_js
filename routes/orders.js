import express from "express";

import authMiddleware from "../middleware/auth.js";
import Orders from "../models/orderModel.js";
import Items from "../models/itemModel.js";

const router = express.Router();

router.post("/create", authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        console.log(req.body)

        const lastOrder = await Orders.findOne({userId, orderStatus: "processing"}).sort({createdAt: -1});
        if (lastOrder) {
            lastOrder.orderStatus = "closed";
            await lastOrder.save();
        }

        const newOrder = new Orders({
            userId: userId,
            items: [{itemId: req.body.itemId, quantity: req.body.amount}],
            totalPrice: req.body.totalPrice,
            amount: req.body.amount
        });
        await newOrder.save();
        return res.status(201).json(newOrder);

    } catch (error) {
        return res.status(400).json({message: 'Error creating order'});
        // return res.status(400).json(error.message);
    }
});

router.post("/add-item", authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const {itemId, quantity} = req.body;

        const itemQuantity = quantity || 1;

        const item = await Items.findById(itemId);
        if (!item) {
            return res.status(404).json({message: "Item not found"});
        }

        const itemTotalPrice = item.price * itemQuantity;
        let order = await Orders.findOne({userId, orderStatus: "processing"}).sort({createdAt: -1});
        if (!order) {
            order = new Orders({
                userId: userId,
                items: [{itemId: item._id, quantity: itemQuantity}],
                totalPrice: itemTotalPrice,
                amount: itemQuantity
            });
        } else {
            order.items.push({itemId: item._id, quantity: itemQuantity});
            order.totalPrice += itemTotalPrice;
            order.amount += itemQuantity;
        }

        await order.save();
        return res.status(200).json(order);

    } catch (error) {
        return res.status(400).json({message: 'Error adding item to order'});
        // return res.status(400).json(error.message);
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

        // if (req.body.totalPrice) order.totalPrice = req.body.totalPrice;
        // if (req.body.amount) order.amount = req.body.amount;

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