import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// import User from "../models/User"; // Import User Model
import dotenv from "dotenv";
import User from "../Model/userModel";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Ensure env variable is set

interface DecodedToken {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; role: string };
    }
  }
}

// 🔹 Middleware to verify JWT and attach user details
const verifytoken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    // 🔹 Fetch user from database to get the role
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    req.user = { id: user._id.toString(), email: user.email, role: user.role };
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

export default verifytoken;


// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// const JWT_SECRET = 'your_jwt_secret_key'; // Ensure this is correctly set in .env

// interface DecodedToken {
//   id: string;
//   email: string;
// }

// declare global {
//   namespace Express {
//     interface Request {
//       user?: DecodedToken;
//     }
//   }
// }

// const verifytoken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   console.log("🔹 Token received:", token); // Debugging

//   if (!token) {
//     res.status(401).json({ error: "Access denied. No token provided" });
//     return;
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
//     console.log("🔹 Decoded Token:", decoded); // Debugging
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.log("🔹 JWT Verification Error:", (error as Error).message); // Debugging
//     res.status(400).json({ error: "Invalid token" });
//   }
// };

// export default verifytoken;


