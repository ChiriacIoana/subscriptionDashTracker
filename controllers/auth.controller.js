import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {JWT_EXPIRATION, JWT_SECRET} from "../config/env.js";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession(); // Start a new session for transaction management
    session.startTransaction(); // Start a transaction

    try {
        //logic to create a new user
        /// What is a req body? -> req.body is an object containing data from the client (POST request)
        const { name, email, password } = req.body;

        //check if user already exists
        const existingUser = await User.findOne({email});

        if(existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409; // Conflict status code
            throw error;
        }

        //hash password ->
        const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
        /// salt = a random string used to hash the password, making it more secure
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the generated salt

        //create a new user
        const newUsers = await User.create([{name, email, password: hashedPassword}], { session }); // Create a new user document in the database within the transaction
        /// session is used to ensure that the operation is part of the transaction

        const token = jwt.sign({userId: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRATION}); // Generate a JWT token for the new user

        await session.commitTransaction(); // Commit the transaction if everything is successful
        session.endSession(); // End the session

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                User: newUsers[0], // Return the newly created user data
            }
        }); // Send a success response with the user data and token

    } catch (error) {
        await session.abortTransaction(); // Rollback the transaction in case of error
        session.endSession(); // End the session
        next(error); // Pass the error to the next middleware
    }
}

export const signIn = async () => {

}

export const signOut = async () => {

}
