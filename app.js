import express from 'express';
import { PORT } from './config/env.js'; // Import the PORT variable from the environment configuration
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";
import cors from 'cors';
import { asyncHandler } from './utils/asyncHandler.js';

const app = express(); // Create an Express application


/// Middleware setup
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json()); // this is a built-in middleware that allows Express to parse JSON request bodies
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Use cookie-parser middleware to parse cookies in requests

app.use(asyncHandler(arcjetMiddleware)); // Use Arcjet middleware for request protection and security

app.use('/api/auth', authRouter); // Use the auth router for authentication-related routes
app.use('/api/users', userRouter); // Use the user router for user-related routes
app.use('/api/v1/subscriptions', subscriptionRouter); // Use the subscription router for subscription-related routes
app.use('/api/v1/workflows', workflowRouter); // Use the workflow router for workflow-related routes

app.get('/', (req, res) => {
    res.send('Welcome to the Subscrition Tracker API!');

});

app.use(errorMiddleware); // Use the error middleware to handle errors globally

// Final catch-all error handler (in case the main error middleware calls next)
app.use((err, req, res, next) => {
    console.error('Final error handler:', err.stack);
    res.status(err.status || err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
});

app.listen(PORT, async () => {
    console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);

    await connectToDatabase();
})
export default app;