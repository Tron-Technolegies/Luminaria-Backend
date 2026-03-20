import { Router } from "express";
import {
  addNewTag,
  claimReward,
  getAllAvailableRewards,
  getUnusedTags,
  scratchReward,
  updateReward,
} from "../controllers/rewardSystemController.js";

const router = Router();

router.get("/", scratchReward);
router.post("/", claimReward);
router.get("/all", getAllAvailableRewards);
router.post("/update", updateReward);
router.get("/unused-tags", getUnusedTags);
router.post("/add-tag", addNewTag);

export default router;
