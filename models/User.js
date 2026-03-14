import mongoose, { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    fullName: String,
    phoneNumber: String,
    location: String,
    mapLocation: String,
    vehicleType: String,
    vehicleNumber: String,
    vehicleModel: String,
    tagNumber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
    reward: {
      type: String,
      enum: ["carwash", "polishing", "interior"],
    },
    rewardRedeemed: Boolean,
  },
  { timestamps: true },
);

const User = model("User", UserSchema);
export default User;
