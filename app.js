import express from 'express';
import {PORT} from './config/env.js'; // Import the PORT variable from the environment configuration
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';

const app = express(); // Create an Express application

app.use('api/v1/auth', authRouter); // Use the auth router for authentication-related routes
app.use('/api/v1/users', userRouter); // Use the user router for user-related routes
app.use('/api/v1/subscriptions', subscriptionRouter); // Use the subscription router for subscription-related routes


app.get('/', (req, res) => {
    res.send('Welcome to the Subscrition Tracker API!');

});

app.listen(PORT, () => {
    console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);
})

// Export the app for testing or further configuration
export default app;