import express from "express";
import { getStats, getUsers, getLostFound, getTickets, getDensity } from "../controllers/adminController.js";
import { authenticateClient } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Note: In a production app, we'd add an isAdmin middleware here.
// For now, using authenticateClient as per implementation plan.
router.get("/stats", authenticateClient, getStats);
router.get("/users", authenticateClient, getUsers);
router.get("/lostfound", authenticateClient, getLostFound);
router.get("/tickets", authenticateClient, getTickets);
router.get("/density", authenticateClient, getDensity);

export default router;
