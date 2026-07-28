import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
    createFolder,
    getFolders,
    updateFolder,
    deleteFolder
} from "../controllers/folderController.js";

const router = express.Router();

// ==========================================
// FOLDER ROUTES
// ==========================================

// Create Folder
router.post("/", authMiddleware, createFolder);

// Get All Folders
router.get("/", authMiddleware, getFolders);

// Update Folder
router.put("/:id", authMiddleware, updateFolder);

// Delete Folder
router.delete("/:id", authMiddleware, deleteFolder);

export default router;