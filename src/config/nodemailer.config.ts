import nodemailer from "nodemailer";
import ENV_CONFIG from "./env.config";

export interface SMTPConfig {
  host: string;
  port: number;
  secure?: boolean;
  user: string;
  pass: string;
} 

const transporter = nodemailer.createTransport({
  host: ENV_CONFIG.smtp_host,
  port: ENV_CONFIG.smtp_port,
  secure: ENV_CONFIG.smtp_port === 465,
  auth: {
    user: ENV_CONFIG.smtp_user,
    pass: ENV_CONFIG.smtp_pass,
  },
  tls: { rejectUnauthorized: false },

});

export const verifySMTPConnection = async()=>{
    try{
        await transporter.verify();
        console.log("server is ready to take our message");

    }catch(err){
        console.log("Veriication failed:", err);


    };
};
export default transporter;