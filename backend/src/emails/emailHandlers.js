import { resendClient,sender } from "../lib/resend.js"
import {createWelcomeEmailTemplate} from "./emailTemplates.js"

export const sendWelcomeEmail = async (email,name, clientURL) =>{
    // console.log(clientURL);
    const {data,error} = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to chatUp!",
        html: createWelcomeEmailTemplate(name, clientURL),
    });
    if(error){
        console.error("Error sending welcome email,: " , error)
        throw new Error("failed to send welcome email");
    }
    console.log("Welcome Email send Successfully" , data);
}