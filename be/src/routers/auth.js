import express, { Router } from "express";
import { getUserById, logout, refreshToken, signin, signup } from "../controllers/auth";
import { checkAuth } from "../middleware/checkAuth";
const router = Router();

router.post("/auth/signup", signup);
router.post("/auth/signin", signin);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/user",checkAuth , getUserById);

export default router;
