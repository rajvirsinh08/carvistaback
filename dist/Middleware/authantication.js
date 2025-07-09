"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = 'your_jwt_secret_key'; // Ensure this is correctly set in .env
const verifytoken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    console.log("🔹 Token received:", token); // Debugging
    if (!token) {
        res.status(401).json({ error: "Access denied. No token provided" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        console.log("🔹 Decoded Token:", decoded); // Debugging
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log("🔹 JWT Verification Error:", error.message); // Debugging
        res.status(400).json({ error: "Invalid token" });
    }
});
exports.default = verifytoken;
// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// const JWT_SECRET = 'your_jwt_secret_key';
// // const blacklisttoken=require('../models/BlacklistTokenmodal');
// // import blacklisttoken from '../models/BlacklistTokenmodal';
// interface DecodedToken {
//   _id: string;
//   email: string;
// }
// declare global {
//   namespace Express {
//     interface Request {
//       user?: DecodedToken;
//     }
//   }
// }
// const verifytoken = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) {
//     res.status(401).json({ error: 'Access denied. No token provided' });
//     return;
//   }
//   try {
//     // const blacklistentry = await blacklisttoken.findOne({ token });
//     // if (blacklistentry) {
//     //   res
//     //     .status(401)
//     //     .json({ message: 'You`re successfully loggedout.please login' });
//     //   return;
//     // }
//     const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(400).json({ error: 'Invalid token' });
//     return;
//   }
// };
// export default verifytoken;
