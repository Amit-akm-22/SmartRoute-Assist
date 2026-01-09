import mongoose from "mongoose";

const lostFoundSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    reportedByEmail: {
      type: String,
      required: true,
    },
    reportedByPhone: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const LostFound = mongoose.model("LostFound", lostFoundSchema);

export default LostFound;
