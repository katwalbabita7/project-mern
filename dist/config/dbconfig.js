"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDb = (DB_URI) => {
    mongoose_1.default.connect(DB_URI)
        .then(async () => {
        console.log("Database connected");
        try {
            await mongoose_1.default.connection.collection('users').dropIndex('profile_image.publicId_1');
        }
        catch (e) { }
        try {
            await mongoose_1.default.connection.collection('users').dropIndex('profile_image_1');
        }
        catch (e) { }
    })
        .catch((err) => {
        console.log("................Database connection error.....");
        console.log(err);
    });
};
exports.connectDb = connectDb;
