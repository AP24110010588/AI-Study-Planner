import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
    generateQuiz,
    submitQuiz,
    getQuizHistory,
    getQuizStatistics,
    getQuizStreak
} from "../controllers/quizController.js";

const router = express.Router();

/* ==========================================
   GENERATE AI QUIZ
========================================== */

router.post(
    "/generate",
    authMiddleware,
    generateQuiz
);

/* ==========================================
   SUBMIT QUIZ
========================================== */

router.post(
    "/submit",
    authMiddleware,
    submitQuiz
);

/* ==========================================
   QUIZ HISTORY
========================================== */

router.get(
    "/history",
    authMiddleware,
    getQuizHistory
);

/* ==========================================
   QUIZ STATISTICS
========================================== */

router.get(
    "/statistics",
    authMiddleware,
    getQuizStatistics
);

router.get("/streak", authMiddleware, getQuizStreak);
export default router;