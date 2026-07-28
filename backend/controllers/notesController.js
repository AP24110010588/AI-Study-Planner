import { supabase } from "../config/supabase.js";

// ==========================================
// CREATE NOTE
// ==========================================

export const createNote = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            title,
            subject,
            content,
            folder_id
        } = req.body;

        const { data, error } = await supabase
            .from("notes")
            .insert([{
                user_id: userId,
                title,
                subject,
                content,
                folder_id
            }])
            .select();

        if (error) {

            return res.status(400).json({

                success: false,
                message: error.message

            });

        }

        res.json({

            success: true,
            note: data[0]

        });

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

// ==========================================
// GET NOTES
// ==========================================

export const getNotes = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("notes")
            .select("*")
            .eq("user_id", req.user.id)
            .order("created_at", { ascending: false });

        if (error) {

            return res.status(400).json({

                success: false,
                message: error.message

            });

        }

        res.json({

            success: true,
            notes: data

        });

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

// ==========================================
// UPDATE NOTE
// ==========================================

export const updateNote = async (req, res) => {

    try {

        const { id } = req.params;

        const {
    title,
    subject,
    content,
    folder_id
} = req.body;

        const { data, error } = await supabase
            .from("notes")
            .update({
    title,
    subject,
    content,
    folder_id,
    updated_at: new Date()
})
            .eq("id", id)
            .eq("user_id", req.user.id)
            .select();

        if (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

        res.json({
            success: true,
            note: data[0]
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ==========================================
// DELETE NOTE
// ==========================================

export const deleteNote = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = await supabase
            .from("notes")
            .delete()
            .eq("id", id)
            .eq("user_id", req.user.id);

        if (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

        res.json({
            success: true,
            message: "Note Deleted Successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ==========================================
// TOGGLE FAVORITE
// ==========================================

export const toggleFavorite = async (req, res) => {

    try {

        const { id } = req.params;

        const { favorite } = req.body;

        const { data, error } = await supabase
            .from("notes")
            .update({ favorite })
            .eq("id", id)
            .eq("user_id", req.user.id)
            .select();

        if (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

        res.json({
            success: true,
            note: data[0]
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

