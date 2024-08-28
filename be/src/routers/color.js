import { Router } from "express";
import {
    create,
    getAllColors,
} from "../controllers/color";

const router = Router();
router.get("/colors", getAllColors);
// router.get("/products/:id", getProductById);
// router.get("/products/:categoryId/related/:productId", related);
// router.delete("/products/:id", deleteProductById);
// router.put("/products/:id/edit", updateProductById);
router.post("/colors/add", create);
export default router;
