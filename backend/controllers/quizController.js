import ai from "../config/gemini.js";
import { supabase } from "../config/supabase.js";

/* ==========================================
   GENERATE AI QUIZ
========================================== */

export const generateQuiz = async (req, res) => {

    try {

        const { topic, difficulty, questions } = req.body;

        if (!topic) {

            return res.status(400).json({
                success: false,
                message: "Topic is required."
            });

        }

        const prompt = `
Generate exactly ${questions || 10} multiple choice questions.

Topic: ${topic}
Difficulty: ${difficulty || "Easy"}

Rules:

1. Every question must ONLY be about "${topic}".
2. Each question must have exactly 4 options.
3. Only one option should be correct.
4. Return ONLY valid JSON.

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
    "correctAnswer":2
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

        res.json({

            success: true,

            questions: quiz

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/* ==========================================
   SUBMIT QUIZ
========================================== */

export const submitQuiz = async (req, res) => {

    try {

        const userId = req.user.id;

        const {

            topic,
            difficulty,
            totalQuestions,
            score,
            accuracy,
            timeTaken

        } = req.body;

       const percentage = Math.round(
    (score / totalQuestions) * 100
);

const { error } = await supabase

    .from("quiz_results")

    .insert({

        user_id: userId,

        subject: topic,

        score,

        total_questions: totalQuestions,

        percentage,

        completed_at: new Date().toISOString()

    });

        if (error) throw error;

        res.json({

            success: true,

            message: "Quiz submitted successfully."

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/* ==========================================
   QUIZ HISTORY
========================================== */

export const getQuizHistory = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("quiz_history")

            .select("*")

            .eq("user_id", req.user.id)

            .order("created_at", {

                ascending: false

            });

        if (error) throw error;

        res.json({

            success: true,

            history: data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/* ==========================================
   QUIZ STATISTICS
========================================== */

export const getQuizStatistics = async (req, res) => {

    try {

        const { data, error } = await supabase

            .from("quiz_history")

            .select("score,total_questions,accuracy")

            .eq("user_id", req.user.id);

        if (error) throw error;

        const totalQuizzes = data.length;

        const averageAccuracy = totalQuizzes
            ? Math.round(
                data.reduce((sum, quiz) => sum + quiz.accuracy, 0) /
                totalQuizzes
            )
            : 0;

        res.json({

            success: true,

            statistics: {

                totalQuizzes,

                averageAccuracy

            }

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const getQuizStreak = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("quiz_results")
            .select("completed_at")
            .eq("user_id", req.user.id)
            .order("completed_at", { ascending: false });

        if (error) throw error;

        const uniqueDays = [
            ...new Set(
                data.map(item =>
                    new Date(item.completed_at)
                        .toISOString()
                        .split("T")[0]
                )
            )
        ];

        let streak = 0;
        let currentDate = new Date();

        while (true) {

            const day = currentDate.toISOString().split("T")[0];

            if (uniqueDays.includes(day)) {

                streak++;

                currentDate.setDate(currentDate.getDate() - 1);

            } else {

                break;

            }

        }

        res.json({

            success: true,

            streak

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};