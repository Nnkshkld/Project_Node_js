import express from "express";

import authMiddleware from "../middleware/auth.js";
import Orders from "../models/orderModel.js";
import Items from "../models/itemModel.js";
import paginationMiddleware from "../middleware/pagination.js";
import {paginateQuery} from "../core/utils.js";

const router = express.Router();

router.post("/create", authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;

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

        const item = await Items.findById(itemId);
        if (!item) {
            return res.status(404).json({message: "Item not found"});
        }

        const itemQuantity = quantity || 1;
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
        const {id, items} = req.body;

        const order = await Orders.findOne({_id: id, userId: userId});
        if (!order) {
            return res.status(404).json({message: "Order not found"});
        }

        let totalPrice = 0;
        let totalQuantity = 0;
        for (const item of items) {
            const {itemId, quantity} = item;

            const foundItem = await Items.findById(itemId);
            if (!foundItem) {
                return res.status(404).json({message: `Item with ID ${itemId} not found`});
            }

            totalPrice += foundItem.price * quantity;
            totalQuantity += quantity;
        }

        order.items = req.body.items;
        order.totalPrice = totalPrice;
        order.amount = totalQuantity;
        await order.save();

        return res.status(200).json({
            message: "Order updated successfully",
            order
        });

    } catch (error) {
        console.error("Error:", error);
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

router.get("/get-all-orders", authMiddleware, paginationMiddleware, async (req, res) => {
    try {
        const {page, limit} = req.pagination;
        const filter = {}
        const result = await paginateQuery(Orders, filter, page, limit);
        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({message: "Error retrieving orders"});
    }
});

router.get("/get-all-user-orders/:userId", authMiddleware, paginationMiddleware, async (req, res) => {
    const {userId} = req.params;

    try {
        const {page, limit} = req.pagination;
        const filter = {userId};

        const result = await paginateQuery(Orders, filter, page, limit);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error retrieving orders:", error);
        res.status(400).json({message: "Error retrieving orders"});
    }
});

export default router;