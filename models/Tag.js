import { model, Schema } from "mongoose";

const TagSchema = new Schema(
  {
    tagNumber: String,
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Tag = model("Tag", TagSchema);
export default Tag;
