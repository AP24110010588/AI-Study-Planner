import express from "express";

import {
    createNote,
    getNotes,
    updateNote,
    deleteNote,
    toggleFavorite
} from "../controllers/notesController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// NOTES ROUTES
// ==========================================

// Create Note
router.post("/", authMiddleware, createNote);

// Get All Notes
router.get("/", authMiddleware, getNotes);

// Update Note
router.put("/:id", authMiddleware, updateNote);

// Delete Note
router.delete("/:id", authMiddleware, deleteNote);

// Favorite / Unfavorite Note
router.put("/favorite/:id", authMiddleware, toggleFavorite);

export default router;