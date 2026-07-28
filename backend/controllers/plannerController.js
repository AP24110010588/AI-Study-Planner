import { supabase } from "../config/supabase.js";

// Add Planner Task
// Add Planner Task (Updated to accept priority and status)
export const addPlannerTask = async (req, res) => {
    try {
        const {
    title,
    description,
    study_date,
    start_time,
    end_time,
    priority,
    status
} = req.body;

        const userId = req.user.id;

        const { data, error } = await supabase
            .from("planner")
            .insert([
               {
    user_id: userId,
    title,
    description,
    study_date,
    start_time,
    end_time,
    completed: false
}
            ])
            .select();
            await supabase
  .from("calendar_events")
  .insert([
    {
      planner_id: data[0].id,      // Link to planner task
      user_id: userId,
      title: title,
      description: description,
      event_date: study_date,
      start_time: start_time,
      end_time: end_time,
      event_type: "Study"
    }
  ]);

    

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        res.status(201).json({
            success: true,
            message: "Task Added Successfully",
            task: data
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};



// Get Planner Tasks
export const getPlannerTasks = async (req, res) => {

    try {

        const userId = req.user.id;

        const { data, error } = await supabase
            .from("planner")
            .select("*")
            .eq("user_id", userId)
            .order("study_date", { ascending: true });

        if (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

        res.json({
            success: true,
            tasks: data
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

export const completeTask = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = await supabase
            .from("planner")
            .update({ completed: true })
            await supabase
  .from("calendar_events")
  .update({
    title,
    description,
    event_date: study_date,
    start_time,
    end_time,
    event_type: "Study"
  })
  
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
            message: "Task completed"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
// ==========================================
// DELETE TASK
// ==========================================

export const deleteTask = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = await supabase
            .from("planner")
            .delete()
            .eq("id", id)
            .eq("user_id", req.user.id);
            await supabase
    .from("calendar_events")
    .delete()
    .eq("planner_id", id);

        if (error) {

            return res.status(500).json({

                success: false,
                message: error.message

            });

        }

        res.json({

            success: true,
            message: "Task Deleted Successfully"

        });

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

// ==========================================
// UPDATE TASK
// ==========================================

export const updateTask = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            title,
            description,
            study_date,
            start_time,
            end_time,
            priority,
            status
        } = req.body;

        const { data, error } = await supabase
            .from("planner")
            .update({
                title,
                description,
                study_date,
                start_time,
                end_time,
                priority,
                status,
                completed: status === "completed"
            })
            .eq("id", id)
            .eq("user_id", req.user.id)
            .select();
await supabase
    .from("calendar_events")
    .update({

        title,

        description,

        event_date: study_date,

        start_time,

        end_time

    })
    .eq("planner_id", id);
        if (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

        res.json({
            success: true,
            message: "Task Updated Successfully",
            task: data
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};