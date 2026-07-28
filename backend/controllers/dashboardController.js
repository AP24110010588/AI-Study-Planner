import { supabase } from "../config/supabase.js";

export const getDashboard = async (req, res) => {

    try {

        const userId = req.user.id;

        const today = new Date().toISOString().split("T")[0];

        /* ==========================================
           LOAD ALL DASHBOARD DATA
        ========================================== */

        const [
            { data: subjects },
            { data: planner },
            { data: notes },
            { data: calendar },
            { data: flashcards },
            { data: quizzes },
            { data: goals }

        ] = await Promise.all([

            supabase
                .from("subjects")
                .select("*")
                .eq("user_id", userId),

            supabase
                .from("planner")
                .select("*")
                .eq("user_id", userId),

            supabase
                .from("notes")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", {
                    ascending: false
                }),

            supabase
                .from("calendar_events")
                .select("*")
                .eq("user_id", userId)
                .order("event_date", {
                    ascending: true
                }),

            supabase
                .from("flashcards")
                .select("*")
                .eq("user_id", userId),

            supabase
                .from("quiz_results")
                .select("*")
                .eq("user_id", userId),

            supabase
                .from("goals")
                .select("*")
                .eq("user_id", userId)

        ]);

        /* ==========================================
           BASIC COUNTS
        ========================================== */

        const todayTasks = planner.filter(task =>
            task.study_date === today
        );

        const completedTasks = planner.filter(task =>
            task.completed
        );

        const progress =
            planner.length === 0
                ? 0
                : Math.round(
                    (completedTasks.length /
                        planner.length) * 100
                );

        const totalSubjects = subjects.length;

        const totalTasks = planner.length;

        const totalNotes = notes.length;

        const totalFlashcards =
            flashcards.length;

        const totalCalendarEvents =
            calendar.length;

        /* ==========================================
           QUIZ AVERAGE
        ========================================== */

        const averageQuizScore =
            quizzes.length === 0
                ? 0
                : Math.round(

                    quizzes.reduce(

                        (sum, quiz) =>

                            sum +
                            (quiz.percentage || 0),

                        0

                    ) / quizzes.length

                );

        /* ==========================================
           STUDY HOURS
        ========================================== */

        const studyHours = planner.reduce(

            (total, task) => {

                const start = new Date(
                    `2000-01-01T${task.start_time}`
                );

                const end = new Date(
                    `2000-01-01T${task.end_time}`
                );

                const hours = Math.max(

                    0,

                    (end - start) / 3600000

                );

                return total + hours;

            },

            0

        );

        /* ==========================================
           STUDY STREAK
        ========================================== */

        const uniqueDays = [

            ...new Set(

                completedTasks.map(

                    task => task.study_date

                )

            )

        ];

        let studyStreak = 0;

        let currentDate = new Date();

        while (true) {

            const day = currentDate

                .toISOString()

                .split("T")[0];

            if (uniqueDays.includes(day)) {

                studyStreak++;

                currentDate.setDate(

                    currentDate.getDate() - 1

                );

            }

            else {

                break;

            }

        }
            /* ==========================================
           WEEKLY STUDY HOURS
        ========================================== */

        const weeklyStudyHours = [0, 0, 0, 0, 0, 0, 0];

        planner.forEach(task => {

            const start = new Date(
                `2000-01-01T${task.start_time}`
            );

            const end = new Date(
                `2000-01-01T${task.end_time}`
            );

            const hours = Math.max(
                0,
                (end - start) / 3600000
            );

            const day = new Date(
                task.study_date
            ).getDay();

            const index =
                day === 0 ? 6 : day - 1;

            weeklyStudyHours[index] += hours;

        });

        /* ==========================================
           RECENT ACTIVITY
        ========================================== */

        const recentActivity = [];

        planner
            .slice(0, 3)
            .forEach(task => {

                recentActivity.push({

                    title: task.title,

                    description:
                        task.completed
                            ? "Task Completed"
                            : "Task Scheduled",

                    date: task.study_date

                });

            });

        notes
            .slice(0, 2)
            .forEach(note => {

                recentActivity.push({

                    title: note.title,

                    description: "New Note",

                    date: note.created_at

                });

            });

        /* ==========================================
           DASHBOARD OBJECT
        ========================================== */

        const dashboard = {

            totalSubjects,

            totalTasks,

            todayTasks,

            upcoming: calendar.slice(0, 5),

            totalNotes,

            notes: notes.slice(0, 5),

            subjects,

            goals,

            studyTime: studyHours.toFixed(1),

            studyStreak,

            productivityScore: progress,

            progress,

            weeklyScore: averageQuizScore,

            quizScore: averageQuizScore,

            flashcardCount: totalFlashcards,

            totalCalendarEvents,

            weeklyStudyHours,

            goalCompletion: progress,

            recentActivity,

            achievements: {

                streak: studyStreak,

                notes: totalNotes,

                flashcards: totalFlashcards,

                quizzes: quizzes.length,

                totalStudyHours:
                    studyHours.toFixed(1)

            }

        };

                /* ==========================================
           SEND RESPONSE
        ========================================== */

        res.json({

            success: true,

            dashboard

        });

    }

    catch (error) {

        console.error("Dashboard Error:", error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
