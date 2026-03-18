import mongoose from "mongoose";
import Reward from "../models/Reward.js";
import Tag from "../models/Tag.js";
import User from "../models/User.js";
import { generateCouponPDF } from "../services/pdfGeneration.js";

export const scratchReward = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const rewardPool = await Reward.findOne().session(session);

    if (!rewardPool) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Reward pool not found" });
    }

    const rewards = [];

    if (rewardPool.polishing > 0)
      rewards.push(...Array(rewardPool.polishing).fill("polishing"));

    if (rewardPool.interior > 0)
      rewards.push(...Array(rewardPool.interior).fill("interior"));

    if (rewardPool.carwash > 0)
      rewards.push(...Array(rewardPool.carwash).fill("carwash"));

    if (rewards.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "All rewards have been distributed",
      });
    }

    const randomIndex = Math.floor(Math.random() * rewards.length);
    const selectedReward = rewards[randomIndex];

    await session.commitTransaction();
    session.endSession();

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");

    return res.status(200).json({
      success: true,
      reward: selectedReward,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const claimReward = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      fullName,
      phoneNumber,
      location,
      mapLocation,
      vehicleType,
      vehicleNumber,
      vehicleModel,
      tagNumber,
      reward,
    } = req.body;

    session.startTransaction();

    // Find tag
    const tag = await Tag.findOne({ tagNumber }).session(session);

    if (!tag) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        message: "Invalid tag number",
      });
    }

    if (tag.used) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        message: "Tag already used",
      });
    }

    // Mark tag as used
    tag.used = true;
    await tag.save({ session });

    // Decrement the reward count correctly now
    const rewardUpdate = await Reward.updateOne(
      { [reward]: { $gt: 0 } },
      { $inc: { [reward]: -1 } },
      { session }
    );

    if (rewardUpdate.modifiedCount === 0) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        message: "Sorry, this reward is no longer available.",
      });
    }

    // Create user record
    const user = new User({
      fullName,
      phoneNumber,
      location,
      mapLocation,
      vehicleType,
      vehicleNumber,
      vehicleModel,
      tagNumber: tag._id,
      reward,
      rewardRedeemed: true,
    });
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();
    const pdfBuffer = await generateCouponPDF(user, tagNumber);

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=coupon-${tagNumber}.pdf`,
    );

    res.send(pdfBuffer);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      message: error.message,
    });
  }
};
