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
}

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
}
