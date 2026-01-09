import express from "express";

const router = express.Router();

// Fallback status for the crowd detection engine
router.get("/api/status", (req, res) => {
    res.json({
        camera_active: false,
        message: "AI Detection Engine Offline. Using database metrics."
    });
});

// Fallback zones data
router.get("/api/zones", (req, res) => {
    res.json({
        total: 0,
        zones: []
    });
});

export default router;
