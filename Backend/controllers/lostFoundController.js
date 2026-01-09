// controllers/lostFoundController.js
import LostFound from "../models/LostFound.js";

export const createLostFound = async (req, res) => {
  try {
    console.log("DEBUG: createLostFound req.body:", req.body);
    console.log("DEBUG: createLostFound req.user:", req.user);
    console.log("DEBUG: createLostFound req.file:", req.file);

    const { title, description, status } = req.body;

    if (!title || !status) {
      return res.status(400).json({ success: false, message: "Title and status are required" });
    }

    const { email, phone } = req.user || {};

    if (!email || !phone) {
      console.error("DEBUG: email or phone missing from req.user");
      return res.status(401).json({
        success: false,
        message: "User profile incomplete. Please ensure you are logged in and have a phone number set."
      });
    }

    const image = req.file ? req.file.filename : null;

    const item = await LostFound.create({
      title,
      description,
      status,
      reportedByEmail: email,
      reportedByPhone: phone,
      image,
    });

    res.status(201).json({ success: true, item });
  } catch (error) {
    console.error("DEBUG: createLostFound Error:", error);
    res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};

export const getLostFoundItems = async (req, res) => {
  try {
    const items = await LostFound.find()
      .sort({ uploadedAt: -1 });
    if (!items) {
      res.status(500).json({ success: false, message: "NO item available" });
    }
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
