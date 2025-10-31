import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: users
        });

    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Exclude password field from the response
        /// we also extract the user ID from the request parameters

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404; // Not Found status code
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: user
        });

    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email } = req.body;

        if (req.user._id.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update user",
        });
    }
};
export const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res
                .status(400)
                .json({ success: false, message: "Both fields are required" });
        }

        const user = await User.findById(userId).select("+password");
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ success: false, message: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update password",
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "Account deleted successfully",
            data: { id: userId }
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete account",
        });
    }
};
