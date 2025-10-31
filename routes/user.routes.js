import { Router } from 'express';
import User from "../models/user.model.js";
import authorize from "../middlewares/auth.middleware.js";
import { getUser, getUsers, updateUser, changePassword, deleteUser } from "../controllers/user.controller.js";

const userRouter = Router();

// define a route that gets all users
userRouter.get('/', getUsers);

// get the details of a specific user by ID
userRouter.get('/:id', authorize, getUser);

// create a new user
/// POST/users -> create a new user
userRouter.post('/', (req, res) => {
    res.send({ title: 'CREATE new user' }); // Placeholder response for fetching all users
});

//nu
userRouter.put('/me', authorize, async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, email } = req.body;

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
});

// update an existing user by ID
userRouter.put('/:id', authorize, updateUser);

userRouter.put('/:id/password', authorize, changePassword);

// delete an existing user by ID
userRouter.delete('/:id', authorize, deleteUser);

export default userRouter;