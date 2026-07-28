import express from "express";

import {
    getSettings,
    updateSettings
} from "../controllers/settingsController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================
   SETTINGS ROUTES
========================================== */

// Get user settings
router.get("/", authMiddleware, getSettings);

// Update user settings
router.put("/", authMiddleware, updateSettings);

export default router;