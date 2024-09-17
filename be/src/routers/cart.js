import { Router } from "express";
import {
    updateProductQuantity,
    addItemToCart,
    getCartByUserId,
    removeFromCart,
} from "../controllers/cart";
import {checkAuth} from "../middleware/checkAuth"

const router = Router();

// lấy danh sách sản phẩm trong giỏ hàng dựa vào ID
router.get("/carts",checkAuth,getCartByUserId);
// Thêm sản phẩm vào giỏ hàng
// Cập nhật số lượng của sản phẩm trong giỏ hàng từ input
router.post("/carts/add-to-cart", checkAuth,addItemToCart);
// Cập nhật số lượng của sản phẩm trong giỏ hàng từ button
router.put("/carts/update",checkAuth, updateProductQuantity);
// Xóa item trong giỏ hàng
router.post("/carts/remove",checkAuth ,removeFromCart);

export default router;
