import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    userType: {
      type: String,
      enum: ["Civilian", "VIP", "Sadhu", "Admin", "Aged"],
      default: "Civilian",
    },
    password: { type: String, required: true },
    unique_code: { type: String, unique: true, sparse: true }, // QR/RFID code
    profile_image: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Client = mongoose.model("Client", clientSchema);

export default Client;
