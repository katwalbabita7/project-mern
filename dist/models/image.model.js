"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Image schema
exports.imageSchema = new mongoose_1.default.Schema({
    path: {
        type: String,
        required: [true, "path is required"],
    },
    publicId: {
        type: String,
        required: [true, "Public ID is required"],
        unique: true,
    },
});
