import express from "express";

import authMiddleware from "../middleware/auth.js";
import Items from "../models/itemModel.js";
import {ItemAvailability} from "../core/constants.js";

const router = express.Router();

router.post("/create-item", authMiddleware, async (req, res) => {
    try {
        const item = new Items({
            owner: req.user._id,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        });
        await item.save();
        return res.status(201).json({
            message: "Item has been successfully added",
            details: item
        })

    } catch (error) {
        return res.status(400).json({message: 'Error creating item'});
    }
});

router.patch("/edit-item", authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const itemId = req.body.itemId;

        const item = await Items.findOne({_id: itemId, owner: userId});
        if (!item) {
            return res.status(400).json({
                message: "You can edit only your items",
                help: "Please check the itemId if you have the item"
            });
        }

        if (req.body.name) item.name = req.body.name;
        if (req.body.description) item.description = req.body.description;
        if (req.body.status) item.availabilityStatus = req.body.status;
        if (req.body.price) item.price = req.body.price;

        await item.save();
        return res.status(200).json(item);

    } catch (error) {
        return res.status(400).json({message: "Error updating item"});
    }
});

router.delete("/delete-item", authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const itemId = req.body.itemId;

        const item = await Items.findOne({_id: itemId, owner: userId});
        if (!item) {
            return res.status(400).json({
                message: "You can delete only your items",
                help: "Please check the itemId if you have the item"
            });
        }

        await item.deleteOne();
        return res.status(204).json({message: "Item successfully deleted"});

    } catch (error) {
        return res.status(400).json({message: "Error deleting item"});
    }
});

router.get("/find-by-id/:itemId", async (req, res) => {
    const {itemId} = req.params;
    const item = await Items.findOne({_id: itemId});
    if (!item) {
        return res.status(404).json({message: "Item not found"});
    }

    return res.status(200).json(item);

});

router.get("/get-all-items", async (req, res) => {
    try {
        const filter = {};

        if (req.query.price) {
            filter.price = {$lt: Number(req.query.price)};
        }

        if (req.query.active) {
            filter.availabilityStatus = req.query.active === 'true'
                ? ItemAvailability.AVAILABLE
                : ItemAvailability.NOT_AVAILABLE;
        }

        const items = await Items.find(filter);
        res.status(200).json(items);
    } catch (error) {
        res.status(400).json({ message: "Error retrieving items" });
    }
});

export default router;