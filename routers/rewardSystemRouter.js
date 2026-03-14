import { Router } from "express";
import {
  claimReward,
  scratchReward,
} from "../controllers/rewardSystemController.js";

const router = Router();

router.get("/", scratchReward);
router.post("/", claimReward);

export default router;
