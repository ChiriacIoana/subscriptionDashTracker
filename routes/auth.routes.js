import { Router } from 'express';
import authorize from "../middlewares/auth.middleware.js";
import { signUp, signOut, signIn, getMe } from '../controllers/auth.controller.js';

const authRouter = Router();

// Path: /api/auth/register (POST)
authRouter.post('/register', signUp); // This will handle user registration requests

// Path: /api/auth/login (POST)
authRouter.post('/login', signIn); // This will handle user login requests

// Path: /api/auth/logout (POST)
authRouter.post('/logout', signOut); // This will handle user logout requests

// Path: /api/auth/me (GET) - requires authentication
authRouter.get('/me', authorize, getMe); // This will get current user info

export default authRouter;