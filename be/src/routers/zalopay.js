import { Router } from "express";
import { callBack, zaloPay } from "../controllers/zaloPay";

const router = Router();

router.post("/zalopay", zaloPay);
router.post("/callback", callBack);
export default router;
