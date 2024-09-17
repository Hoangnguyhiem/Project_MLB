import { Router } from "express";
import { createOrder, getOrderById, getOrderByUserId, getOrders } from "../controllers/order";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

router.post("/orders", createOrder);
router.get("/orders", getOrders);
router.get("/orders/:userId/:orderId", getOrderById);
router.get("/orders-userId",checkAuth , getOrderByUserId);

export default router;
