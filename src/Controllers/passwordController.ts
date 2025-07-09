import { Request, Response } from 'express';
import User from '../Model/userModel';
import nodemailer from 'nodemailer';
// import bcrypt from 'bcrypt';

const BASE_URL = 'http://localhost:5000'; // Update with frontend URL

// Generate a 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send Reset OTP
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Generate OTP and expiry
    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();

    // Send OTP via email (async)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your password reset OTP is: ${otp}. It is valid for 10 minutes.`,
    };

    // Don't await this if you want faster response
    transporter.sendMail(mailOptions).catch(console.error);

    res.status(200).json({ message: "Password reset OTP sent to email" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       res.status(400).json({ error: "Email is required" });
//       return;
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       res.status(404).json({ error: "User not found" });
//       return;
//     }

//     // Generate OTP and expiry
//     const otp = generateOTP();
//     user.resetPasswordOTP = otp;
//     user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     await user.save();

//     // Send OTP via email (async)
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: user.email,
//       subject: "Password Reset OTP",
//       text: `Your password reset OTP is: ${otp}. It is valid for 10 minutes.`,
//     };

//     // Don't await this if you want faster response
//     transporter.sendMail(mailOptions).catch(console.error);

//     res.status(200).json({ message: "Password reset OTP sent to email" });
//   } catch (error) {
//     console.error("Error in forgotPassword:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
//verify otp
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ error: "Invalid or expired OTP" });
      return;
    }

    res.status(200).json({ message: "OTP Verified Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Reset Password using OTP
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({
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
    user.password =  newPassword;

    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
  
    await user.save();
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};