import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { supabase } from "../config/supabase.js";
dotenv.config();

// 1. Initialize the SDK with the key securely pulled from .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// ==========================================
// SUMMARIZE NOTES
// ==========================================

export const summarizeNotes = async (req, res) => {

    try {

        const { content } = req.body;

        if (!content) {

            return res.status(400).json({

                success: false,

                message: "Content is required"

            });

        }

        const response = await ai.models.generateContent({

            model: "gemini-2.5-flash",

            contents: `Summarize these study notes into easy-to-read bullet points:

${content}`

        });

        res.json({

            success: true,

            result: response.text

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ==========================================
// GENERATE QUIZ
// ==========================================

export const generateQuiz = async (req, res) => {
    try {

        const { topic, difficulty, questions } = req.body;

       if (!topic) {
            return res.status(400).json({
                success: false,
              message: "Topic is required"
            });
        }
const prompt = `
Generate exactly ${questions || 10} multiple choice quiz questions.

Topic: ${topic}
Difficulty: ${difficulty || "Easy"}

IMPORTANT RULES:
- Every question MUST be ONLY about "${topic}".
- Do NOT ask questions from any other topic.
- Do NOT generate generic programming questions.
- Each question must have exactly 4 options.
- Only one option should be correct.
- Return ONLY valid JSON.

Format:

[
  {
    "question":"Question",
    "options":[
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "answer":"Correct Option"
  }
]
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        let text = response.text;

        text = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const quiz = JSON.parse(text);

const user_id = req.user.id;

const rows = quiz.map((q) => ({

    user_id,

   subject: topic,

    difficulty: difficulty || "Easy",

    question: q.question,

    option1: q.options[0],

    option2: q.options[1],

    option3: q.options[2],

    option4: q.options[3],

    correct_answer: q.answer

}));

const { error } = await supabase
    .from("quizzes")
    .insert(rows);

if (error) {

    return res.status(500).json({

        success: false,

        message: error.message

    });

}

res.json({
    success: true,
    message: "Quiz generated successfully.",
    count: rows.length,
    questions: quiz
});
    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ==========================================
// GENERATE FLASHCARDS
// ==========================================

export const generateFlashcards = async (req, res) => {

    try {

        const { content } = req.body;

        if (!content) {

            return res.status(400).json({

                success: false,

                message: "Content is required"

            });

        }

        const response = await ai.models.generateContent({

            model: "gemini-2.5-flash",

            contents: `Create 10 flashcards from the following study material.

Format:

Front:
Back:

Study Material:
${content}`

        });

        res.json({

            success: true,

            result: response.text

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ==========================================
// GENERATE STUDY CALENDAR
// ==========================================

export const generateCalendar = async (req, res) => {

    try {

        const { prompt } = req.body;

        if (!prompt) {

            return res.status(400).json({

                success: false,

                message: "Prompt is required"

            });

        }

        const response = await ai.models.generateContent({

            model: "gemini-2.5-flash",

            contents: `Create a study calendar for the following request.

Include:

• Daily Schedule
• Study Time
• Break Time
• Revision Time

Request:

${prompt}`

        });

        res.json({

            success: true,

            result: response.text

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ==========================================
// DASHBOARD AI RECOMMENDATIONS
// ==========================================

// ==========================================
// DASHBOARD AI RECOMMENDATIONS
// ==========================================

export const generateRecommendations = async (req, res) => {

    try {

        const { subjects = "", tasks = "" } = req.body;

        if (!subjects.trim()) {

            return res.json({

                success: true,

                result:
`• Add at least one subject.
• Create today's study plan.
• Complete one study session.
• Revise yesterday's topics.`

            });

        }

        const prompt = `
You are an AI Study Planner.

Subjects:
${subjects}

Today's Tasks:
${tasks || "No tasks available"}

Generate exactly 4 short study recommendations.

Rules:
- One sentence each.
- Return plain bullet points.
- No markdown.
- Keep each recommendation under 20 words.
`;

        const response = await ai.models.generateContent({

            model: "gemini-2.5-flash",

            contents: prompt

        });

        const result =
            response.text || "• Keep studying consistently.";

        return res.json({

            success: true,

            result

        });

    }

    catch (error) {

        console.error(
            "AI Recommendation Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message || "AI Recommendation Failed"

        });

    }

};

export const generateAnalytics = async (req, res) => { };

export const generateDashboardInsights = async (req, res) => { };

export const generateStudyPlan = async (req, res) => {
    try {
        const { prompt } = req.body;

        // 2. We use the recommended 'gemini-2.5-flash' model for fast response times
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an AI Study Planner. Create a clean study schedule for: ${prompt}`,
        });

        res.json({
            success: true,
            plan: response.text // 3. This returns your generated markdown text!
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};