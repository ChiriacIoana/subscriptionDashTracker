import mongoose from 'mongoose';
import {DB_URI, NODE_ENV} from "../config/env.js";

if(!DB_URI) {
    throw new Error("Please set the DB_URI environment variable inside .env<development/production>.local file");
}

// Function to connect to MongoDB database
/// asynch because it will take some time to connect to the database

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);

        console.log(`Connected to database in ${NODE_ENV} mode`);
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        // eslint-disable-next-line no-undef
        process.exit(1); // Exit the process with failure code
    }
}
export default connectToDatabase;