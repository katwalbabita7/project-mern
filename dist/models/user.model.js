"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.DEFAULT_AVATAR = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enum_types_1 = require("../@types/enum.types");
const image_model_1 = require("./image.model");
exports.DEFAULT_AVATAR = {
    path: "https://res.cloudinary.com/wwvdrlq3/image/upload/v1789541344/PROJECT/profiles/default_avatar.png",
    publicId: "PROJECT/profiles/default_avatar",
};
// * user schema
exports.userSchema = new mongoose_1.default.Schema({
    full_name: {
        type: String,
        required: [true, "full_name is required"],
        minLength: [3, "full_name must be at least 3 characters."],
    },
    email: {
        type: String,
        required: [true, "email  is required"],
        unique: [true, "user already exists with proviede email"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
        select: false,
    },
    role: {
        type: String,
        enum: Object.values(enum_types_1.Role),
        default: enum_types_1.Role.USER,
    },
    profile_image: {
        type: image_model_1.imageSchema,
        default: () => ({ ...exports.DEFAULT_AVATAR }),
    },
    phone: {
        type: String,
    },
    // Forget / Reset Password
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        select: false,
    },
}, {
    timestamps: true
});
// user model 
const User = mongoose_1.default.model("User", exports.userSchema);
exports.default = User;
