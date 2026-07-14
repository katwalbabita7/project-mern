import multer from "multer";
import fs from "fs";
import path from "path";
import { ApiError } from "../utils/apiError.utils";

export const uploder = () => {
    const folder = "uploads/";
    const fileSize = 5 * 1024 * 1024; // 5MB

    // Create folder if not exists
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, folder);
        },
        filename: (req, file, cb) => {
            const fileName = Date.now() + "_" + file.originalname;
            cb(null, fileName);
        },
    });

    const fileFilter = (req: any, file: any, cb: any) => {
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
        const allowedMimeTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        const fileExt = path.extname(file.originalname).toLowerCase();
        const mimeType = file.mimetype.toLowerCase();

        if (allowedMimeTypes.includes(mimeType) && allowedExtensions.includes(fileExt)) {
            cb(null, true); // Accept file
        } else {
            const error = new ApiError(
                `Invalid file format. Only ${allowedExtensions.join(", ")} files are allowed.`,
                422
            );
            cb(error, false);
        }
    };

    const upload = multer({
        storage,
        fileFilter,
        limits: {
            fileSize: fileSize,
        },
    });

    return upload;
};