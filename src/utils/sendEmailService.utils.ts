import ENV_CONFIG from "../config/nodemailer.config";
import transporter from "../config/nodemailer.config";
const sendEmail = async()=>{
    try{
        await transporter.sendMail({
            to: "babitakatwal49@gmail.com",
            from:"katwalbabita7@gmail.com",
            subject:"hello",
        })
    }catch(error){
        console.log(error);
    }
}