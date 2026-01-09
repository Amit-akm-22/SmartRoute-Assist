import mongoose from "mongoose";

const zoneTrackerSchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    last_zone_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
    },
    current_zone_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
    },
    scanned_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const ZoneTracker = mongoose.model("ZoneTracker", zoneTrackerSchema);

export default ZoneTracker;
