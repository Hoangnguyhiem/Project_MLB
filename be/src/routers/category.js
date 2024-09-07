import { Router } from "express";
import {
    create,
    deleteCategoryById,
    getAllByCategoryId,
    getAllChildren,
    getAllParent,
    getCategoryById,
    getProductsByCategory,
    updateCategoryById
} from "../controllers/category";
import { uploadImage } from "../config/cloudinaryConfig";

const router = Router();
router.get("/collections", getAllParent);
router.get("/subcollections", getAllChildren);
router.get("/collections/:id", getProductsByCategory);


router.get("/categories/:id", getCategoryById);
router.get("/categorieslist/:id", getAllByCategoryId);
router.delete("/categories/:id", deleteCategoryById);
router.put("/categories/:id/edit", updateCategoryById);
router.post("/categories/add", uploadImage.single("image"), create);
export default router;