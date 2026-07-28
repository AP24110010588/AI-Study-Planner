import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  addSubject,
  getSubjects
} from "../controllers/subjectController.js";

const router = express.Router();

router.post("/", authMiddleware, addSubject);
router.get("/", authMiddleware, getSubjects);

export default router;