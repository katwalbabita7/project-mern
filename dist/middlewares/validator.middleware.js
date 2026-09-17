"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        // * if validation failed path:['body','full_name']
        if (!result.success) {
            const errors = result.error.issues.map(({ path, message }) => {
                return {
                    path: path.join("."),
                    message,
                };
            });
            return next({
                message: "validation error",
                statusCode: 400,
                status: "fail",
                errors,
            });
        }
        // * if validation success
        if (result.data.body !== undefined) {
            req.body = result.data.body;
        }
        if (result.data.params !== undefined) {
            req.params = result.data.params;
        }
        if (result.data.query !== undefined) {
            Object.assign(req.query, result.data.query);
        }
        next();
    };
};
exports.validate = validate;
