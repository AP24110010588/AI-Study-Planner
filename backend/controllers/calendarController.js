import { supabase } from "../config/supabase.js";

// ==========================================
// ADD EVENT
// ==========================================

export const addEvent = async (req, res) => {

    try {

        const {
            title,
            description,
            event_date,
            start_time,
            end_time,
            event_type,
            planner_id = null
        } = req.body;

        const user_id = req.user.id;

        const { data, error } = await supabase
            .from("calendar_events")
            .insert([{
                user_id,
                planner_id,
                title,
                description,
                event_date,
                start_time,
                end_time,
                event_type
            }])
            .select();

        if (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

        res.status(201).json({
            success: true,
            event: data[0]
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ==========================================
// GET EVENTS
// ==========================================

export const getEvents = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("calendar_events")
            .select("*")
            .eq("user_id", req.user.id)
            .order("event_date", { ascending: true });

        if (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

        res.json({
            success: true,
            events: data
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ==========================================
// UPDATE EVENT
// ==========================================

export const updateEvent = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = await supabase
            .from("calendar_events")
            .update(req.body)
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
            message: "Event updated successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ==========================================
// DELETE EVENT
// ==========================================

export const deleteEvent = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = await supabase
            .from("calendar_events")
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
            message: "Event deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};