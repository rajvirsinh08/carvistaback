//Express
import express, { Request, Response } from 'express';

//UserModel
import User from '../Model/userModel';

//JwtWebToken
import  jwt  from 'jsonwebtoken';

//Messages
import { Messages } from '../Constants/Messages';
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import mongoose from 'mongoose';
const JWTSECRET="your_jwt_secret_key";

const app = express();

app.use(express.json()); 
const BLOB_TOKEN = "vercel_blob_rw_qTDvCQWBTr2XDZfc_c979p8v281nEthSLbfBBBIKUsPCvTy";

// ✅ Upload profile image to Vercel Blob
async function uploadProfileImageToBlob(buffer: Buffer, originalName: string): Promise<string> {
  const ext = originalName.split(".").pop();
  const uniqueName = `${Date.now()}-${randomUUID()}.${ext}`;
  const blob = await put(uniqueName, buffer, {
    access: "public",
    token: BLOB_TOKEN,
  });
  return blob.url;
}

// Login API
export const signInUser = async (req: Request, res: Response) => {
    try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      res.status(401).json({ error: Messages.InvalidEmail });
      return;
    }
    
    // const isMatch = await bcrypt.compare(password, user.password)/;
    if (user && password === user.password) {
      const token=jwt.sign({id:user._id,email:user.email},JWTSECRET);
      // Exclude password before sending user data
    const { password: _, ...userData } = user.toObject();
      res.status(200).json({ message:Messages.LoginSuccess,token,user: userData});
      return;
     
    }else{
       res.status(401).json({ error: Messages.InvalidEmail });
       return;
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
  }
};
// Create User 
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, contact, password, role } = req.body;

    console.log("Incoming Request:", req.body); // Debugging

    // 🔹 Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { contact }] });
    if (existingUser) {
       res.status(400).json({ error: 'Email or contact already in use' });
       return;
    }

    // 🔹 Assign valid role (default to "user" if not provided)
    const assignedRole = role === 'admin' ? 'admin' : 'user';

    // 🔹 Create new user (No password hashing)
    const user = new User({
      name,
      email,
      contact,
      password, // Stored as plain text (not recommended for production)
      role: assignedRole,
    });

    const savedUser = await user.save();
    console.log("User Saved:", savedUser);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        contact: savedUser.contact,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in createUser:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// export const createUser = async (req: Request, res: Response) => {
//     try {
//     const { name, email,contact, password } = req.body;
//     const user = new User({
//       name,
//       email,
//       contact,
//       password,
//     });

//     const savedUser = await user.save();
//     res.status(201).json(savedUser);
//   } catch (error) {
//     if(error instanceof Error)
//     res.status(400).json({ error: error.message });
//     return;
//   }
// };

// Get All Users 
// export const getAllUsers = async (req: Request, res: Response) => {
//     try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     if(error instanceof Error)
//     res.status(400).json({ error: error.message });
//     return;
//   }
// };
// controllers/userController.ts
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.isActive).length;

    res.status(200).json({ totalUsers, activeUsers, users });
  } catch (error) {
    if (error instanceof Error)
      res.status(400).json({ error: error.message });
  }
};

// Get User by ID 
export const getSingleUsers = async (req: Request, res: Response) => {
  const { id } = req.params;

  // ✅ Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
     res.status(400).json({ error: "Invalid user ID format" });
     return;
  }

  try {
    const singleUser = await User.findById(id);
    if (singleUser) {
      res.status(200).json(singleUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown server error" });
    }
  }
};
// export const getSingleUsers = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//       const singleUser = await User.findById(id);
//       if (singleUser) {
//         res.status(200).json(singleUser);
//         return;
//       } else {
//         res.status(404).json(Messages.UserNotFound);
//         return;
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         res.status(500).json({ error: error.message });
//         return;
//       } else {
//         res.status(500).json({ error: Messages.UnknownError });
//         return;
//       }
//     }
//   };


// // Update User 
// export const updateUser = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   if (!id) {
//        res.status(400).json({ error: "User ID is required" });
//        return
//   }

//   try {
//       const updatedUser = await User.findByIdAndUpdate(id, req.body, {
//           new: true,
//           runValidators: true, 
//       });

//       if (!updatedUser) {
//            res.status(404).json({ error: "User not found" });
//            return
//       }

//       res.status(200).json({ message: "User updated successfully", user: updatedUser });
//   } catch (error) {
//       console.error("Update User Error:", error);
//       if (error instanceof Error) {
//           res.status(500).json({ error: error.message });
//       } else {
//           res.status(500).json({ error: "An unexpected error occurred" });
//       }
//   }
// };
// ✅ Update User
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
     res.status(400).json({ error: "User ID is required" });
     return;
  }

  try {
    let profileImageUrl;

    if (req.file) {
      profileImageUrl = await uploadProfileImageToBlob(req.file.buffer, req.file.originalname);
    }

    const updateData: any = {
      ...req.body,
    };

    if (profileImageUrl) {
      updateData.profileImage = profileImageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
       res.status(404).json({ error: "User not found" });
       return;
    }

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};


// Delete User 
export const deleteUser = async (req: Request, res: Response) => {

    const { id } = req.params;
    try {
      const singleUser = await User.findByIdAndDelete(id);
      if (!singleUser) {
        res.status(404).json({ error:Messages.UserNotFound });
      }
      // res.status(200).json(singleUser);
      res.status(200).json({ user: singleUser, message: "User deleted successfully" });

    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  };