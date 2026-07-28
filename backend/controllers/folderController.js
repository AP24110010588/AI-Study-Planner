import { supabase } from "../config/supabase.js";

// ==========================================
// CREATE FOLDER
// ==========================================

export const createFolder = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            folder_name,
            folder_icon
        } = req.body;

        const { data, error } = await supabase
            .from("note_folders")
            .insert([
                {
                    user_id: userId,
                    folder_name,
                    folder_icon
                }
            ])
            .select();

        if (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

        res.status(201).json({
            success: true,
            folder: data[0]
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ==========================================
// GET FOLDERS
// ==========================================

export const getFolders = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("note_folders")
            .select("*")
            .eq("user_id", req.user.id)
            .order("created_at", { ascending: true });

        if (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

        res.json({
            success: true,
            folders: data
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ==========================================
// UPDATE FOLDER
// ==========================================

export const updateFolder = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            folder_name,
            folder_icon
        } = req.body;

        const { data, error } = await supabase
            .from("note_folders")
            .update({
                folder_name,
                folder_icon
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
            folder: data[0]
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ==========================================
// DELETE FOLDER
// ==========================================

export const deleteFolder = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = await supabase
            .from("note_folders")
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
            message: "Folder deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};