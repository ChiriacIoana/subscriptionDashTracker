import express from 'express';
import {PORT} from './config/env.js'; // Import the PORT variable from the environment configuration

const app = express(); // Create an Express application

app.get('/', (req, res) => {
    res.send('Welcome to the Subscrition Tracker API!');

});

app.listen(PORT, () => {
    console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);
})

// Export the app for testing or further configuration
export default app;