import { supabase } from "../config/supabase.js";

// ==========================
// Add Subject
// ==========================

export const addSubject = async (req, res) => {

    try {

        const { subject_name, progress, color } = req.body;

        const userId = req.user.id;

        if (!subject_name) {

            return res.status(400).json({
                success: false,
                message: "Subject name is required"
            });

        }

        const { data, error } = await supabase
            .from("subjects")
            .insert([
                {
                    user_id: userId,
                    subject_name,
                    progress: progress || 0,
                    color: color || "#4F46E5"
                }
            ])
            .select();

        if (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

        res.status(201).json({
            success: true,
            message: "Subject Added Successfully",
            subject: data
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================
// Get All Subjects
// ==========================

export const getSubjects = async (req, res) => {

    try {

        const userId = req.user.id;

        const { data, error } = await supabase
            .from("subjects")
            .select("*")
            .eq("user_id", userId);

        if (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

        res.json({

            success: true,

            subjects: data

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};