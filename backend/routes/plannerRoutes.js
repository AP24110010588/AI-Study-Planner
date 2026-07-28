import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
    addPlannerTask,
    getPlannerTasks,
    completeTask,
    deleteTask,
    updateTask
} from "../controllers/plannerController.js";
const router = express.Router();

// Add Task
router.post("/", authMiddleware, addPlannerTask);

// Get All Tasks
router.get("/", authMiddleware, getPlannerTasks);
router.delete("/:id", authMiddleware, deleteTask);

router.put(
    "/complete/:id",
    authMiddleware,
    completeTask
);
router.delete(
    "/:id",
    authMiddleware,
    deleteTask
);
router.put(
    "/:id",
    authMiddleware,
    updateTask
);

export default router;

