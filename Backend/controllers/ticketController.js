import Ticket from "../models/ticket.js";
import Client from "../models/client.js";
import QRCode from "qrcode";
// Create Ticket
export const createTicket = async (req, res) => {
  try {
    const { date, time, temple, no_of_tickets } = req.body;
    const client_id = req.user.client_id;
    if (no_of_tickets > 10) {
      return res
        .status(400)
        .json({ message: "Max 10 tickets allowed per booking." });
    }

    const client = await Client.findById(client_id);
    if (!client) {
      return res.status(404).json({ message: "Client not found." });
    }

    const ticket = await Ticket.create({
      client_id,
      date,
      time,
      temple,
      no_of_tickets,
    });

    const qrData = {
      ticket_id: ticket._id,
      client_id: ticket.client_id,
      temples: ticket.temple,
      date: ticket.date,
      time: ticket.time,
    };

    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

    // Save QR code back into ticket
    ticket.qr_code = qrCode;
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Tickets by Client ID
export const getTicketsByClient = async (req, res) => {
  try {
    const client_id = req.user.client_id;

    const tickets = await Ticket.find({ client_id })
      .populate("client_id", "name phone email userType")
      .sort({ created_at: -1 });

    if (!tickets.length) {
      return res.status(200).json([]);
    }


    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
