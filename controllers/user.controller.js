import User from "../models/user.model.js";

// function that fetches all users from the database
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

// function that gets a single user from the database
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
