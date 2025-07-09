"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// 🟢 Configure Storage
const storage = multer_1.default.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path_1.default.extname(file.originalname)}`);
    },
});
// 🟢 File Type Filter (Only JPEG, JPG, PNG)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        cb(null, true);
    }
    else {
        cb(new Error("Only images (jpeg, jpg, png) are allowed!"));
    }
};
// 🟢 Multer Upload Config
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10MB
    fileFilter,
});
// 🟢 Middleware for multiple & specific image uploads
exports.uploadMultiple = upload.fields([
    { name: "exteriorimage", maxCount: 1 },
    { name: "interiorimage", maxCount: 1 },
    { name: "tyreimage", maxCount: 1 },
]);
