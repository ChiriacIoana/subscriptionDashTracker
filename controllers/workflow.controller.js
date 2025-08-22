import dayjs from 'dayjs';

import { createRequire } from 'module';
import Subscription from "../models/subscription.model.js";
import {sendReminderEmail} from "../utils/send-email.js";
const require = createRequire(import.meta.url); // Create a require function to import CommonJS modules in an ES module context

const { serve } = require('@upstash/workflow/express') // Import the serve function from Upstash Workflow Express with const because it is a CommonJS module

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload; // Extract the subscriptionId from the request payload
    const subscription = await fetchSubscription(context, subscriptionId); // Fetch the subscription using the provided subscriptionId

    const REMINDERS = [7, 5, 2, 1]; // Define the reminder intervals in days

    if(!subscription || subscription.status != 'active') {
        return;
    }
    const renewalDate = dayjs(subscription.renewalDate); // Get the renewal date of the subscription

    if(renewalDate.isBefore(dayjs())) {
       console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow`); // Log a message if the subscription has already expired
         return;
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day'); // Calculate the reminder date by subtracting the number of days from the renewal date

        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder((context, `reminder ${daysBefore} days before`, reminderDate)); // Sleep until the reminder date
        }
        await triggerReminder(context, `${daysBefore} days before reminder`, subscription); // Trigger the reminder
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate("user", "name email"); // Fetch the subscription from the database by its ID and populate the user field with the email
    });
}

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate()); // Sleep until the specified date
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run('label', async () => {
        console.log(`Triggering ${label} reminder`); // Log the reminder trigger
        //send email, SMS, push notification etc.
        // This is where you would implement the logic to send the actual reminder
        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        })
    })
}