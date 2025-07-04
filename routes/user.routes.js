import {Router} from 'express';

import authorize from "../middlewares/auth.middleware.js";
import {getUser, getUsers} from "../controllers/user.controller.js";

const userRouter = Router();

// define a route that gets all users
/// GET/users -> get all users
userRouter.get('/', getUsers);

// get the details of a specific user by ID
/// GET/users/:id -> get user by ID
userRouter.get('/:id', authorize, getUser);

// create a new user
/// POST/users -> create a new user
userRouter.post('/', (req, res) => {
    res.send({title: 'CREATE new user'}); // Placeholder response for fetching all users
});

// update an existing user by ID
/// PUT/users/:id -> update user by ID
userRouter.put('/:id', (req, res) => {
    res.send({title: 'UPDATE user'}); // Placeholder response for fetching all users
});

// delete an existing user by ID
/// DELETE/users/:id -> delete user by ID
userRouter.delete('/:id', (req, res) => {
    res.send({title: 'DELETE user'}); // Placeholder response for fetching all users
});

export default userRouter;