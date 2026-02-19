import { resendClient, sender } from "../lib/resend.js"; 
import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js";


export const sendWelcomeEmail=async (email,name,clientURL) => {
    const {data,error}=await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to:email,
        subject:"welcome to chatting app",
        html:createWelcomeEmailTemplate(name,clientURL)

})
if(error){
    console.log(error.message)
}
else{
    console.log(data)
    console.log(`Email sent to ${email}`)
}
}