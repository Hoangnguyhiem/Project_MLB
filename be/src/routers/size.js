import { Router } from "express";
import {
    create,
    getAllSizes,
} from "../controllers/size";

const router = Router();
router.get("/sizes", getAllSizes);
// router.get("/products/:id", getProductById);
// router.get("/products/:categoryId/related/:productId", related);
// router.delete("/products/:id", deleteProductById);
// router.put("/products/:id/edit", updateProductById);
router.post("/sizes/add", create);
export default router;
