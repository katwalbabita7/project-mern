"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = void 0;
const generateSlug = (schema) => {
    schema.pre("save", function (next) {
        const doc = this;
        if (doc.isModified("name") && doc.name) {
            doc.slug = doc.name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-");
        }
        next();
    });
};
exports.generateSlug = generateSlug;
