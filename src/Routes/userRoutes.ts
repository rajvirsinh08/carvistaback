//Express
import express from "express";

//UserController
import {
  createUser,
  signInUser,
  getAllUsers,
  getSingleUsers,
  deleteUser,
  updateUser,
} from "../Controllers/userController"; 

//Authentication
import verifytoken from "../Middleware/authantication";
import { forgotPassword, resetPassword, verifyOtp } from "../Controllers/passwordController";
import { estimatePrice } from "src/Controllers/priceEstimateController";
import isAdmin from "../Middleware/isAdmin";
import { uploadProfileImage } from "../Middleware/upload";

const router = express.Router();

router.post("/adduser", createUser);
router.post("/signin", signInUser);
router.get("/allusers", verifytoken,isAdmin,getAllUsers);
router.get("/getsingleuser/:id", verifytoken,getSingleUsers);
router.delete("/deleteuser/:id",verifytoken,isAdmin, deleteUser);
router.patch("/updateuser/:id",verifytoken,uploadProfileImage, updateUser);
router.post('/forgot-password', forgotPassword);  
router.post('/reset-password', resetPassword);
router.post("/verify-otp", verifyOtp);

export default router;
