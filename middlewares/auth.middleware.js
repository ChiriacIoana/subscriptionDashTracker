import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from "../models/user.model.js";

// someone is making a request to get user details -> authorize middleware -> verify token -> if valid -> give access to the user details

const authorize = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
            /// the purpose of this is to check if the token is present in the request headers
        }

        if (!token)
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        const decoded = jwt.verify(token, JWT_SECRET); // Verify the token using the secret key
        /// this will decode the token and extract the user ID from it

        const user = await User.findById(decoded.userId) // Find the user by ID

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        req.user = user; // Attach the user to the request object for further use in the application

    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized access',
            error: error.message || 'An error occurred while authorizing the user'
        });
        next(error);
    }
}

export default authorize;

