import { MailOptions } from "nodemailer/lib/json-transport";
import ENV_CONFIG from "../config/nodemailer.config";
import transporter from "../config/nodemailer.config";

export interface IMailOptions {
  to: string;
  subject: string;
  html: string;
  cc?: string  | string[];
  bcc?: string | string[];
  attachments?: any[];
} 

export const sendEmail = async(mailOptions : IMailOptions)=>{
     const {to,html,subject,bcc,cc,attachments} = mailOptions 
    try{
        const options:MailOptions = {
            to,
            html,
            subject,

        };
        if(bcc){
            options["bcc"] =bcc;
        }
        if(cc){
            options["cc"] =cc;
        }
        if(attachments){
            options["attachments"] =attachments;
        }



        await transporter.sendMail(options);
        console.log("mail send");
    }catch(error){
        console.log(error);
    }
}