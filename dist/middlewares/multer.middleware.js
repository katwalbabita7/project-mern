"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploder = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const apiError_utils_1 = require("../utils/apiError.utils");
const uploder = () => {
    const folder = "uploads/";
    const fileSize = 5 * 1024 * 1024; // 5MB
    // Create folder if not exists
    if (!fs_1.default.existsSync(folder)) {
        fs_1.default.mkdirSync(folder, { recursive: true });
    }
    // const storage = multer.memoryStorage();
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, folder);
        },
        filename: (req, file, cb) => {
            const fileName = Date.now() + "_" + file.originalname;
            cb(null, fileName);
        },
    });
    const fileFilter = (req, file, cb) => {
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
        const allowedMimeTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];
        const fileExt = path_1.default.extname(file.originalname).toLowerCase();
        const mimeType = file.mimetype.toLowerCase();
        if (allowedMimeTypes.includes(mimeType) && allowedExtensions.includes(fileExt)) {
            cb(null, true); // Accept file
        }
        else {
            const error = new apiError_utils_1.ApiError(`Invalid file format. Only ${allowedExtensions.join(", ")} files are allowed.`, 422);
            cb(error, false);
        }
    };
    const upload = (0, multer_1.default)({
        storage,
        fileFilter,
        limits: {
            fileSize: fileSize,
        },
    });
    return upload;
};
exports.uploder = uploder;
