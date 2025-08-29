import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET } from "../config/env.js";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession(); // Start a new session for transaction management
    session.startTransaction(); // Start a transaction

    try {
        //logic to create a new user
        /// What is a req body? -> req.body is an object containing data from the client (POST request)
        const { name, email, password } = req.body;

        //check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409; // Conflict status code
            throw error;
        }

        //hash password ->
        const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
        /// salt = a random string used to hash the password, making it more secure
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the generated salt

        //create a new user
        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session }); // Create a new user document in the database within the transaction
        /// session is used to ensure that the operation is part of the transaction

        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION }); // Generate a JWT token for the new user

        await session.commitTransaction(); // Commit the transaction if everything is successful
        session.endSession(); // End the session

        res.status(201).json({
            success: true,
            message: 'User created sdwuccessfully',
            data: {
                token,
                user: newUsers[0], // Return the newly created user data

            }
        }); // Send a success response with the user data and token

    } catch (error) {
        await session.abortTransaction(); // Rollback the transaction in case of error
        session.endSession(); // End the session
        next(error); // Pass the error to the next middleware
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body; // Extract email and password from the request body

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password); // Compare the provided password with the hashed password in the database
        if (!isPasswordValid) {
            const error = new Error('Invalid password');
            error.statusCode = 401; // Unauthorized status code
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION }); // Generate a JWT token for the user if sigh-in validation is successful

        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user, // Return the user data
            }
        }); // Send a success response with the user data and token

    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {
    try {
        // For JWT-based auth, logout is typically handled client-side by removing the token
        // But we can still provide an endpoint for consistency
        res.status(200).json({
            success: true,
            message: 'User signed out successfully'
        });
    } catch (error) {
        next(error);
    }
}

export const getMe = async (req, res, next) => {
    try {
        // The user is already attached to req by the authorize middleware
        const user = req.user;

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            }
        });
    } catch (error) {
        next(error);
    }
}
