import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    qr_code: {
      type: String, // will store Base64 QR string or image path
    },
    temple: {
      type: String,
    },
    no_of_tickets: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
