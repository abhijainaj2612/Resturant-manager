const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderType: {
        type: String,
        enum: ["online", "takeaway", "inrestaurant"],
        required: true,
    },
    formData: {
        name: { type: String, required: true },
        phone: String,
        address: String,
    },
    items: [
        {
            name: String,
            price: Number,
        },
    ],
    totalAmount: Number,
    status: {
        type: String,
        enum: ["pending", "confirmed", "rejected", "completed"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Order", orderSchema);
