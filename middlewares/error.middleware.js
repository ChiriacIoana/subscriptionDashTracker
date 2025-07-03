const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err}; // Create a copy of the error object and deconstruct it
        /// ... is a spread operator that copies all properties of the error object, so i can safely modify the error without messing the original err
        error.message = err.message || 'Internal Server Error';

        console.error(err); // Log the error to the console

        // Mongoose bad object ID error
        if(err.name === 'CastError') {
           const message = 'resource not found'; // Set a user-friendly error message

            // this creates a new error object using the custom message for the user to see
            error = new Error(message);
            error.statusCode = 404; // Set the status code to 404 Not Found

        }

        // Mongoose duplicate key error
        if (err.code === 11000) {
            const message = 'Duplicate field value entered'; // Set a user-friendly error message

            error = new Error(message);
            error.statusCode = 400; // Set the status code to 400 Bad Request
        }

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message).join(', '); // Join all validation error messages

            error = new Error(message);
            error.statusCode = 400; // Set the status code to 400 Bad Request
        }

        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Internal Server Error'
        }); // Send the error response

    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;