"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.hash = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// * hash
const hash = async (password) => {
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        return await bcryptjs_1.default.hash(password, salt);
    }
    catch (error) {
        throw error;
    }
};
exports.hash = hash;
// * compare
const compare = async (password, hash) => {
    try {
        return await bcryptjs_1.default.compare(password, hash);
    }
    catch (error) {
        throw error;
    }
};
exports.compare = compare;
