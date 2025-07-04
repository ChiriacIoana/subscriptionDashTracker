import aj from '../config/arcjet.js';

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {requested: 1}); // Protect the request using Arcjet's protection mechanism

        // Check if the request is allowed or denied
        if(decision.isDenied()) {
            if(decision.reason.isRateLimit()) {
                return res.status(429).json({
                    success: false,
                    message: 'Rate limit exceeded. Please try again later.'
                });
            }
            if(decision.reason.isBot()) {
                return res.status(403).json({
                    success: false,
                    message: 'Bot detected.'
                });
            }

            return res.status(403).json({error: 'Access denied.'});
        }

        next(); // If the request is allowed, proceed to the next middleware or route handler

    } catch (error) {
        console.error(`Arcjet Middleware Error: ${error}`);
        next(error);
    }
}

export default arcjetMiddleware;