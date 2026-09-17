"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins = ["http://localhost:3000", "https://yourfrontend.com"];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
exports.default = corsOptions;
