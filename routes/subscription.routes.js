import { Router } from 'express';
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription, getuserSubscriptions } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

// Define a route to get all subscriptions
subscriptionRouter.get('/', (req, res) => {
    res.send({ title: 'GET all subscriptions' }); // Placeholder response for fetching all subscriptions
});

// Define a route to get a specific subscription by ID
subscriptionRouter.get('/:id', (req, res) => {
    res.send({ title: 'GET subscription details' }); // Placeholder response for fetching all subscriptions
});

// Define a route to create a new subscription
subscriptionRouter.post('/', authorize, createSubscription);


// Define a route to delete a subscription by ID
subscriptionRouter.put('/:id', (req, res) => {
    res.send({ title: 'UPDATE subscription' }); // Placeholder response for fetching all subscriptions
});

// Define a route to delete a subscription by ID
subscriptionRouter.delete('/:id', (req, res) => {
    res.send({ title: 'DELETE subscription' }); // Placeholder response for fetching all subscriptions
});

// Define a route to get all subscriptions for a specific user
subscriptionRouter.get('/user/:id', authorize, getuserSubscriptions);

// Define a route to cancel a subscription by ID
subscriptionRouter.put('/:id/cancel', (req, res) => {
    res.send({ title: 'CANCEL subscription' }); // Placeholder response for fetching all subscriptions
});

// Define a route to get upcoming renewals for all subscriptions
subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({ title: 'GET upcoming renewals' }); // Placeholder response for fetching all subscriptions
});

export default subscriptionRouter;