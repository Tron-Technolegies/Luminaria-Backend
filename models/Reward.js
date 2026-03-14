import { model, Schema } from "mongoose";

const RewardSchema = new Schema(
  {
    polishing: Number,
    interior: Number,
    carwash: Number,
  },
  { timestamps: true },
);

const Reward = model("Reward", RewardSchema);
export default Reward;
