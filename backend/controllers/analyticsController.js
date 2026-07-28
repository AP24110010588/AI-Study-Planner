import { supabase } from "../config/supabase.js";

export const getAnalytics = async (req, res) => {

    try {

        const userId = req.user.id;
        /* ==========================================
   LOAD DATA
========================================== */

const { data: planner } = await supabase
    .from("planner")
    .select("*")
    .eq("user_id", userId);

const { data: calendar } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("user_id", userId);

const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId);

const { data: flashcards } = await supabase
    .from("flashcards")
    .select("*")
    .eq("user_id", userId);

const { data: quizzes } = await supabase
    .from("quizzes")
    .select("*")
    .eq("user_id", userId);

const { data: subjects } = await supabase
    .from("subjects")
    .select("*")
    .eq("user_id", userId);

const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId);
    /* ==========================================
   TOTAL STUDY TIME
========================================== */

const totalStudyTime = planner.reduce((total, task) => {

    const start = new Date(`2000-01-01T${task.start_time}`);
    const end = new Date(`2000-01-01T${task.end_time}`);

    const duration = Math.max(
        0,
        (end - start) / 1000
    );

    return total + duration;

}, 0);

/* ==========================================
   QUIZ AVERAGE
========================================== */

const averageQuizScore = quizzes.length
    ? Math.round(
        quizzes.reduce(
            (sum, quiz) => sum + (quiz.score || 0),
            0
        ) / quizzes.length
    )
    : 0;

/* ==========================================
   FLASHCARDS
========================================== */

const flashcardsReviewed = flashcards.length;

const mastered = flashcards.filter(
    card => card.mastered
).length;

const difficult = flashcards.filter(
    card => card.difficulty === "Hard"
).length;

/* ==========================================
   STUDY STREAK
========================================== */

const uniqueStudyDays = [

    ...new Set(

        planner
            .filter(task => task.completed)
            .map(task => task.study_date)

    )

];

let studyStreak = 0;

let currentDate = new Date();

while (true) {

    const day = currentDate
        .toISOString()
        .split("T")[0];

    if (uniqueStudyDays.includes(day)) {

        studyStreak++;

        currentDate.setDate(
            currentDate.getDate() - 1
        );

    } else {

        break;

    }

}

/* ==========================================
   WEEKLY STUDY HOURS
========================================== */

const weeklyStudyHours = [0,0,0,0,0,0,0];

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

    const index = day === 0 ? 6 : day - 1;

    weeklyStudyHours[index] += hours;

});
/* ==========================================
   ANALYTICS OBJECT
========================================== */

const analytics = {

    totalStudyTime,

    studyStreak,

    averageQuizScore,

    flashcardsReviewed,

    weeklyStudyHours,

    subjectPerformance: subjects.map(subject => ({

        subject: subject.subject_name,

        score: subject.progress || 0

    })),

    goals,

    totalNotes: notes.length,

    totalPlannerTasks: planner.length,

    completedPlannerTasks:

        planner.filter(task => task.completed).length,

    calendarEvents: calendar.length,

    masteredFlashcards: mastered,

    difficultFlashcards: difficult

};

/* ==========================================
   SEND RESPONSE
========================================== */

res.json({

    success: true,

    analytics

});

} catch (error) {

    console.error("Analytics Error:", error);

    res.status(500).json({

        success: false,

        message: error.message

    });

}

};