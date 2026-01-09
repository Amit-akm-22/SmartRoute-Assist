import Client from "../models/client.js";
import LostFound from "../models/LostFound.js";
import Ticket from "../models/ticket.js";
import Zone from "../models/zone.js";

export const getStats = async (req, res) => {
    try {
        const totalUsers = await Client.countDocuments();
        const totalTickets = await Ticket.countDocuments();
        const totalLostItems = await LostFound.countDocuments();

        // Simple revenue calculation (e.g., 50 per ticket)
        const revenueCount = totalTickets * 50;
        const revenue = `₹${(revenueCount / 100000).toFixed(1)}L`;

        res.json({
            totalUsers,
            totalTickets,
            totalLostItems,
            revenue
        });
    } catch (error) {
        console.error("Admin Stats Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await Client.find().sort({ created_at: -1 });
        res.json(users);
    } catch (error) {
        console.error("Admin Users Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getLostFound = async (req, res) => {
    try {
        const items = await LostFound.find().sort({ uploadedAt: -1 });
        res.json(items);
    } catch (error) {
        console.error("Admin LostFound Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find().populate("Client", "name").sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        console.error("Admin Tickets Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getDensity = async (req, res) => {
    try {
        const zones = await Zone.find();
        const densityData = zones.map(z => ({
            zone_id: z._id,
            count: z.client_count || 0
        }));
        res.json(densityData);
    } catch (error) {
        console.error("Admin Density Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
