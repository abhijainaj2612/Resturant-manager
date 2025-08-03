const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect } = require("../middleware/verifyToken");

router.post("/order", async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        const io = req.app.get("io");
        io.emit("newOrder", order);
        res.status(201).json({ message: "Order saved successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to save order" });
    }
});

router.get("/orders", protect, async (req, res) => {
    const { status, startDate, endDate } = req.query;
    const query = {};

    if (status) query.status = status;
    if (startDate && endDate) {
        query.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }

    try {
        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

router.put("/order/:id/status", protect, async (req, res) => {
    const { status } = req.body;
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: "Failed to update order status" });
    }
});


module.exports = router;
