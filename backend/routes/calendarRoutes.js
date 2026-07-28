import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {

    addEvent,
    getEvents,
    updateEvent,
    deleteEvent

} from "../controllers/calendarController.js";

const router = express.Router();

// ==========================================
// CALENDAR ROUTES
// ==========================================

// Get All Events
router.get("/", authMiddleware, getEvents);

// Add Event
router.post("/", authMiddleware, addEvent);

// Update Event
router.put("/:id", authMiddleware, updateEvent);

// Delete Event
router.delete("/:id", authMiddleware, deleteEvent);

export default router;