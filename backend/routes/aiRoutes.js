import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
    generateStudyPlan,
    summarizeNotes,
    generateRecommendations,
    generateQuiz,
    generateFlashcards,
    generateCalendar,
    generateAnalytics,
    generateDashboardInsights,
    
} from "../controllers/aiController.js";

const router = express.Router();

// Planner
router.post("/generate-plan", authMiddleware, generateStudyPlan);

// Notes
router.post("/summarize", authMiddleware, summarizeNotes);

// Quiz
router.post("/quiz", authMiddleware, generateQuiz);

// Flashcards
router.post("/flashcards", authMiddleware, generateFlashcards);

// Calendar
router.post("/calendar", authMiddleware, generateCalendar);

// Analytics
router.post("/analytics", authMiddleware, generateAnalytics);

// Dashboard
router.post("/dashboard", authMiddleware, generateDashboardInsights);
router.post("/recommendations", authMiddleware, generateRecommendations
);

export default router;