import mongoose from "mongoose";

const qrCodeSchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    unique_code: {
      type: String,
      required: true,
      unique: true,
    },
    qr_image: {
      type: String, // store base64 string of QR
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const QRCodeModel = mongoose.model("QRCode", qrCodeSchema);

export default QRCodeModel;
