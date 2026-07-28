import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
    getProfile,
    updateProfile,
    changePassword
} from "../controllers/profileController.js";
const router = express.Router();

router.get(
    "/",
    authMiddleware,
    getProfile
);
router.put(
    "/",
    authMiddleware,
    updateProfile
);
router.put(
    "/change-password",
    changePassword
);
export default router;