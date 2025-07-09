import nodemailer from "nodemailer";
import {EMAIL_PASSWORD} from "./env.js";

const trasporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'chiriacioana2008@gmail.com', // Your email address
        pass: EMAIL_PASSWORD  // Your email password or app password
    }
});

export default trasporter;