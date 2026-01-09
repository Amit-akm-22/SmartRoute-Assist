import mongoose from "mongoose";

const zoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    location_info: { type: String }, // optional: lat/lng or address
    client_count: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Zone = mongoose.model("Zone", zoneSchema);

export default Zone;
