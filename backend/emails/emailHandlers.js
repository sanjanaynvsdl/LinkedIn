import { mailtrapClient, sender } from "../lib/mailtrap.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail= async (email, name, profileUrl)=> {
    const recipient = [{email}];
    try{
        const response=await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Welcome to LinkedIn", 
            html:createWelcomeEmailTemplate(name, profileUrl),
            category:"Welcome",
        });

        console.log("Welcome email sent sucessfully!", response);

    } catch(error) {
        // console.log("An error occuredd while sending an welcome email", error.message);
        throw error;

    }
}