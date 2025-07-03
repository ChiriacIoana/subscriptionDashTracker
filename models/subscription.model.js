import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true, // Remove whitespace from both ends of the string
        minLength: 2,
        maxLength: 1000,
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Price cannot be negative'], // Ensure price is not negative
    },
    currency: {
        type: String,
        required: [true, 'Currency is required'],
        trim: true, // Remove whitespace from both ends of the string
        enum: ['USD', 'EUR', 'GBP', 'INR', 'RON'], // Example currencies, can be expanded
        default: 'USD', // Default currency if not specified
    },
    frequency: {
        type: String,
        required: [true, 'Subscription frequency is required'],
        trim: true, // Remove whitespace from both ends of the string
        enum: ['daily', 'weekly', 'monthly', 'yearly'], // Example frequencies, can be expanded
        default: 'monthly', // Default frequency if not specified
    },
    category: {
        type: String,
        required: [true, 'Subscription category is required'],
        trim: true, // Remove whitespace from both ends of the string
        enum: ['entertainment', 'utilities', 'food', 'health', 'other'], // Example categories, can be expanded
        default: 'other', // Default category if not specified
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required'],
        trim: true, // Remove whitespace from both ends of the string
        enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer'], // Example payment methods, can be expanded
        default: 'credit_card', // Default payment method if not specified
    },
    status: {
        type: String,
        required: [true, 'Subscription status is required'],
        trim: true, // Remove whitespace from both ends of the string
        enum: ['active', 'expired', 'cancelled'], // Example statuses, can be expanded
        default: 'active', // Default status if not specified
    },
    startDate: {
        type: Date,
        required: [true, 'Subscription start date is required'],
        default: Date.now, // Default to current date if not specified
        validate: {
            validator: (value) => value <= new Date(), // Ensure start date is not in the future
            message: 'Start date must be in the past',

        }
    },
    renewalDate: {
        type: Date,
        //required: [true, 'Subscription renewal date is required'],
        validate: {
            validator: function (value) {
                return value > this.startDate; // Ensure renewal date is in the future
            },
            message: 'Renewal date must be after the start date',
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User', // The name of the User model
        required: [true, 'User ID is required'], // Ensure user ID is provided
        index: true, // Create an index on the user field for faster lookups
        validate: {
            validator: function (value) {
                return mongoose.Types.ObjectId.isValid(value); // Validate that the user ID is a valid ObjectId
            },
            message: 'Invalid user ID',
        },
    },

}, {timestamps: true}); // Automatically add createdAt and updatedAt fields

//auto-calculate renewal date if missing
subscriptionSchema.pre('save', function () {
    if(!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    //auto update the status is renewal date has passed
    if (this.renewalDate && this.renewalDate < new Date()) {
        this.status = 'expired'; // Set status to expired if renewal date has passed
    }
    // eslint-disable-next-line no-undef
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema); // Create a model from the schema

export default Subscription;