"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_config_1 = __importDefault(require("../config/nodemailer.config"));
const sendEmail = async (mailOptions) => {
    const { to, html, subject, bcc, cc, attachments } = mailOptions;
    try {
        const options = {
            to,
            html,
            subject,
        };
        if (bcc) {
            options["bcc"] = bcc;
        }
        if (cc) {
            options["cc"] = cc;
        }
        if (attachments) {
            options["attachments"] = attachments;
        }
        await nodemailer_config_1.default.sendMail(options);
        console.log("mail send");
    }
    catch (error) {
        console.log(error);
    }
};
exports.sendEmail = sendEmail;
