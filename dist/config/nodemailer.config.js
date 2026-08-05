"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySMTPConnection = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_config_1 = __importDefault(require("./env.config"));
const transporter = nodemailer_1.default.createTransport({
    host: env_config_1.default.smtp_host,
    port: env_config_1.default.smtp_port,
    secure: env_config_1.default.smtp_port === 465,
    auth: {
        user: env_config_1.default.smtp_user,
        pass: env_config_1.default.smtp_pass,
    },
    tls: { rejectUnauthorized: false },
});
const verifySMTPConnection = async () => {
    try {
        await transporter.verify();
        console.log("server is ready to take our message");
    }
    catch (err) {
        console.log("Veriication failed:", err);
    }
    ;
};
exports.verifySMTPConnection = verifySMTPConnection;
exports.default = transporter;
