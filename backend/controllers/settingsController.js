import { supabase } from "../config/supabase.js";

/* ==========================================
   GET SETTINGS
========================================== */

export const getSettings = async (req, res) => {

    try {

        const userId = req.user.id;

        const { data, error } = await supabase
            .from("users")
            .select("full_name, email, preferences")
            .eq("id", userId)
            .single();

        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(200).json(data);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

/* ==========================================
   UPDATE SETTINGS
========================================== */

export const updateSettings = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            full_name,
            email,
            preferences
        } = req.body;

        const { data, error } = await supabase
            .from("users")
            .update({
                full_name,
                email,
                preferences
            })
            .eq("id", userId)
            .select()
            .single();

        if (error) {

            return res.status(400).json({
                message: error.message
            });

        }

        res.status(200).json({
            message: "Settings updated successfully",
            user: data
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};