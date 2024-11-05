import { mailtrapClient, sender } from "../lib/mailtrap.js";
import { createWelcomeEmailTemplate,createCommentNotificationEmailTemplate, createConnectionAcceptedEmailTemplate } from "./emailTemplates.js";

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

export const sendCommentNotificationEmail = async(
    recipientEmail,
    recipientName,
    commenterName,
    postUrl,
    commentContent,
    )=> {

    const recipient = [{email : recipientEmail}];
    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"New comment on your post!",
            html:createCommentNotificationEmailTemplate(recipientName, commenterName, postUrl, commentContent),
            category:"comment_notification",
        });
        console.log("Notification email sent sucessfully!");
    } catch (error) {
        throw error;
    }
}

export const sendConnectionAcceptedEmail = async(
    senderEmail, 
    senderName, 
    recipientName, 
    profileUrl

)=> {
    const recipient= [{email:senderEmail}];

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to : recipient,
            subject:`${recipientName} accpted your connection request!`,
            html:createConnectionAcceptedEmailTemplate(senderName, recipientName, profileUrl),
            category:"connection_accepted",
        })
    } catch (error) {
        throw error;
        
    }

}