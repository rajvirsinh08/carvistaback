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
exports.resetPassword = exports.verifyOtp = exports.forgotPassword = void 0;
const userModel_1 = __importDefault(require("../Model/userModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// import bcrypt from 'bcrypt';
const BASE_URL = 'http://localhost:5000'; // Update with frontend URL
// Generate a 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
// Send Reset OTP
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        // Generate OTP
        const otp = generateOTP();
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10-minute expiry
        yield user.save();
        // Send Email
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: { user: 'rajvirsinhdabhi1@gmail.com', pass: 'erox bwnn iwxo hnip' }, // Use environment variables in production
        });
        const mailOptions = {
            from: 'your_email@gmail.com',
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your password reset OTP is: ${otp}. It is valid for 10 minutes.`,
        };
        yield transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset OTP sent to email' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.forgotPassword = forgotPassword;
//verify otp
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const user = yield userModel_1.default.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: new Date() },
        });
        if (!user) {
            res.status(400).json({ error: "Invalid or expired OTP" });
            return;
        }
        res.status(200).json({ message: "OTP Verified Successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.verifyOtp = verifyOtp;
// Reset Password using OTP
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, newPassword } = req.body;
        const user = yield userModel_1.default.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: new Date() },
        });
        if (!user) {
            res.status(400).json({ error: 'Invalid or expired OTP' });
            return;
        }
        // Hash New Password
        // const salt = await bcrypt.genSalt(10);
        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        yield user.save();
        res.status(200).json({ message: 'Password reset successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.resetPassword = resetPassword;
