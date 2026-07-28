import settingsRoutes from "./routes/settingsRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import studySessionRoutes from "./routes/studySessionRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import plannerRoutes from "./routes/plannerRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import quizRoutes from "./routes/quizRoutes.js";
// ===============================
// Database
// ===============================
import { supabase } from "./config/supabase.js";

// ===============================
// Routes
// ===============================
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

// ===============================
// Middleware
// ===============================
import authMiddleware from "./middleware/authMiddleware.js";

// Load Environment Variables
dotenv.config();

const app = express();

// ===============================
// Middleware
// ===============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


// ===============================
// Home Route
// ===============================

app.get("/", (req, res) => {

    res.json({

        success: true,

        message: "🚀 AI Study Planner Backend Running Successfully"

    });

});

// ===============================
// Test Supabase Connection
// ===============================

app.get("/api/test-db", async (req, res) => {

    const { data, error } = await supabase
        .from("users")
        .select("*");

    if (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

    res.json(data);

});

// ===============================
// Authentication Routes
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/notes", notesRoutes);

// Add this line right below them:
app.use("/api/ai", aiRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/study-session", studySessionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/profile", profileRoutes);
// ===============================
// Dashboard Routes
// ===============================


// ===============================
// Protected Route Example
// ===============================

app.get("/api/profile", authMiddleware, (req, res) => {

    res.json({

        success: true,

        message: "Protected Route",

        user: req.user

    });

});

// ===============================
// 404 Route
// ===============================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Route Not Found"

    });

});

// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`🚀 Server running on port ${PORT}`);

});