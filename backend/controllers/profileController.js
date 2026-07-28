import bcrypt from "bcrypt";
import { supabase } from "../config/supabase.js";
export const getProfile = async (req, res) => {

    try {

        const userId = req.user.id;

        const { data, error } = await supabase
            .from("users")
            .select(`
                id,
                full_name,
                email,
                phone,
                location,
                university,
                degree,
                branch,
                current_year,
                semester,
                cgpa,
                avatar,
                preferences,
                linkedin,
github,
portfolio,
twitter,
study_hours,
day_streak,
quiz_accuracy,
flashcards_reviewed
            `)
            .eq("id", userId)
            .single();

        if (error) {

            return res.status(404).json({
                success: false,
                message: error.message
            });

        }

        return res.json({

            success: true,

            profile: data

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const updateProfile = async (req, res) => {

    try {

        const userId = req.user.id;

        const {

            full_name,
            phone,
            location,
            university,
            degree,
            branch,
            current_year,
            semester,
            cgpa,
            avatar,
            preferences,
            linkedin,
github,
portfolio,
twitter,
study_hours,
day_streak,
quiz_accuracy,
flashcards_reviewed

        } = req.body;

        const { error } = await supabase

            .from("users")

            .update({

                full_name,

                phone,

                location,

                university,

                degree,

                branch,

                current_year,

                semester,

                cgpa:
                    cgpa === "" || cgpa == null
                        ? null
                        : Number(cgpa),

                avatar,
                preferences,
                linkedin,
github,
portfolio,
twitter,
study_hours,
day_streak,
quiz_accuracy,
flashcards_reviewed

            })

            .eq("id", userId);

        if (error) {

            return res.status(400).json({

                success: false,

                message: error.message

            });

        }

        return res.json({

            success: true,

            message: "Profile updated successfully."

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const changePassword = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            currentPassword,
            newPassword
        } = req.body;

        if (!currentPassword || !newPassword) {

            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });

        }

        const { data: user, error } = await supabase
            .from("users")
            .select("password")
            .eq("id", userId)
            .single();

        if (error || !user) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({
                success: false,
                message: "Current password is incorrect."
            });

        }

        const hashedPassword =
            await bcrypt.hash(newPassword, 10);

        const { error: updateError } = await supabase
            .from("users")
            .update({
                password: hashedPassword
            })
            .eq("id", userId);

        if (updateError) {

            return res.status(500).json({
                success: false,
                message: updateError.message
            });

        }

        return res.json({
            success: true,
            message: "Password updated successfully."
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};