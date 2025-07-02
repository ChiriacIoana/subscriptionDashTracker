import mongoose from "mongoose";

// Define the user schema -> this defines the structure of documents in a MongoDB collection
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true, // Remove whitespace from both ends of the string
        minLenghth: 3,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, 'User email is required'],
        unique: true, // Ensure email is unique
        trim: true,
        lowercase: true, // Convert email to lowercase
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'], // Regular expression to validate email format
    },
    password: {
        type: String,
        required: [true, 'User password is required'],
        minLength: 6, // Minimum length for password

    }
},
    {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

const User = mongoose.model('User', userSchema); // Create a model from the schema

export default User;