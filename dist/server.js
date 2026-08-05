"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const dbconfig_1 = require("./config/dbconfig");
const env_config_1 = __importDefault(require("./config/env.config"));
const nodemailer_config_1 = require("./config/nodemailer.config");
const PORT = env_config_1.default.PORT;
const DB_URI = env_config_1.default.DB_URI;
// * connect database
(0, dbconfig_1.connectDb)(DB_URI);
app_1.default.listen(PORT, async () => {
    console.log(`server is running at http://localhost:${PORT}`);
    await (0, nodemailer_config_1.verifySMTPConnection)();
});
