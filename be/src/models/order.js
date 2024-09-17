import { request } from "express";
import { required } from "joi";
import mongoose from "mongoose";

// Hàm để sinh orderNumber
const generateOrderNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
    return `${timestamp}-${random}`;
};

const orderItemSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    productId: {
        type: String,
        required: true,
    },
    variantId: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
});

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    items: [orderItemSchema],
    orderNumber: {
        type: String,
        // required: true,
        unique: true,
    },
    customerName: {
        type: String,
        // required: true,
    },
    totalAmount: {
        type: Number,
        // required: true,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
// Tạo pre-save hook để sinh orderNumber trước khi lưu vào cơ sở dữ liệu
orderSchema.pre("save", function (next) {
    if (!this.orderNumber) {
        this.orderNumber = generateOrderNumber();
    }
    next();
});
export default mongoose.models.Order || mongoose.model("Order", orderSchema);
