import express from 'express';
import {PORT} from './config/env.js'; // Import the PORT variable from the environment configuration
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express(); // Create an Express application

app.use(express.json()); // this is a built-in middleware that allows Express to parse JSON request bodies
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Use cookie-parser middleware to parse cookies in requests

app.use('/api/v1/auth', authRouter); // Use the auth router for authentication-related routes
app.use('/api/v1/users', userRouter); // Use the user router for user-related routes
app.use('/api/v1/subscriptions', subscriptionRouter); // Use the subscription router for subscription-related routes

app.use(errorMiddleware); // Use the error middleware to handle errors globally

app.get('/', (req, res) => {
    res.send('Welcome to the Subscrition Tracker API!');

});

app.listen(PORT, async () => {
    console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);

   await connectToDatabase();
})

// Export the app for testing or further configuration
export default app;