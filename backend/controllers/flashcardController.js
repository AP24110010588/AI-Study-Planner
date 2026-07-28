import { supabase } from "../config/supabase.js";

/* ===========================
   CREATE FLASHCARD
=========================== */

export const createFlashcard = async (req, res) => {

    try {

        const {
            question,
            answer,
            subject,
            difficulty
        } = req.body;

        const user_id = req.user.id;

        const { data, error } = await supabase
            .from("flashcards")
            .insert([
                {
                    user_id,
                    question,
                    answer,
                    subject,
                    difficulty,
                    mastered: false
                }
            ])
            .select();

        if (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

        res.json({
            success: true,
            flashcard: data[0]
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

/* ===========================
   GET FLASHCARDS
=========================== */

export const getFlashcards = async (req, res) => {

    try {

        const user_id = req.user.id;

        const { data, error } = await supabase
            .from("flashcards")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", { ascending: false });

        if (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

        res.json({
            success: true,
            flashcards: data
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

/* ===========================
   UPDATE FLASHCARD
=========================== */

export const updateFlashcard = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            question,
            answer,
            subject,
            difficulty,
            mastered
        } = req.body;

        const { data, error } = await supabase
            .from("flashcards")
            .update({
                question,
                answer,
                subject,
                difficulty,
                mastered
            })
            .eq("id", id)
            .select();

        if (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

        res.json({
            success: true,
            flashcard: data[0]
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

/* ===========================
   DELETE FLASHCARD
=========================== */

export const deleteFlashcard = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = await supabase
            .from("flashcards")
            .delete()
            .eq("id", id);

        if (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

        res.json({
            success: true,
            message: "Flashcard Deleted Successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};