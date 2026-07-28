import { supabase } from "../config/supabase.js";

export const saveStudySession = async (req, res) => {

    try {

        const userId = req.user.id;

        const { duration } = req.body;

        if (!duration || duration <= 0) {

            return res.status(400).json({

                success: false,

                message: "Invalid study duration."

            });

        }

        const sessionDate =
            new Date().toISOString().split("T")[0];

        const { data, error } = await supabase

            .from("study_sessions")

            .insert([

                {

                    user_id: userId,

                    duration,

                    session_date: sessionDate

                }

            ])

            .select();

        if (error) {

            throw error;

        }

        res.status(201).json({

            success: true,

            message: "Study session saved successfully.",

            session: data[0]

        });

    }

    catch (error) {

        console.error("Study Session Error:", error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};