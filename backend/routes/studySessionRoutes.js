import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {

    saveStudySession

} from "../controllers/studySessionController.js";

const router = express.Router();

router.post(

    "/",

    authMiddleware,

    saveStudySession

);

export default router;