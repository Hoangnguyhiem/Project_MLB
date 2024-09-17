import { Router } from "express";
import { addFavoriteUserId, deleteFavoriteUserId, getFavoriteUserId } from "../controllers/favorite.js";
import {checkAuth} from "../middleware/checkAuth"


const router = Router();
router.get("/favorite",checkAuth, getFavoriteUserId);
router.post("/favorite/add",checkAuth, addFavoriteUserId);
router.delete("/favorite/:productId",checkAuth, deleteFavoriteUserId);
export default router;
