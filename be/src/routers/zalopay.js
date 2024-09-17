import { Router } from "express";
import { callBack, zaloPay } from "../controllers/zaloPay";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

router.post("/zalopay",checkAuth , zaloPay);
router.post("/callback", callBack);
export default router;
