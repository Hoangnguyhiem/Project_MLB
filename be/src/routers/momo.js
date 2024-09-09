import { Router } from "express";
import { momo } from "../controllers/momo";

const router = Router();

router.post("/momo", momo);
export default router;
