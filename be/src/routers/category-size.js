import { Router } from "express";
import {
    create,
    getAllCategoriesSize,
} from "../controllers/category-size";

const router = Router();
router.get("/categories-size", getAllCategoriesSize);
// router.get("/products/:id", getProductById);
// router.get("/products/:categoryId/related/:productId", related);
// router.delete("/products/:id", deleteProductById);
// router.put("/products/:id/edit", updateProductById);
router.post("/categories-size/add", create);
export default router;
