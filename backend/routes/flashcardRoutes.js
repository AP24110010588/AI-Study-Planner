import express from "express";

import {
    createFlashcard,
    getFlashcards,
    updateFlashcard,
    deleteFlashcard
} from "../controllers/flashcardController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================
   FLASHCARD ROUTES
========================== */

router.post("/", authMiddleware, createFlashcard);

router.get("/", authMiddleware, getFlashcards);

router.put("/:id", authMiddleware, updateFlashcard);

router.delete("/:id", authMiddleware, deleteFlashcard);

export default router;