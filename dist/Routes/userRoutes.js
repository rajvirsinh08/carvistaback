"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Express
const express_1 = __importDefault(require("express"));
//UserController
const userController_1 = require("../Controllers/userController");
const passwordController_1 = require("../Controllers/passwordController");
const router = express_1.default.Router();
router.post("/adduser", userController_1.createUser);
router.post("/signin", userController_1.signInUser);
router.get("/allusers", userController_1.getAllUsers);
router.get("/getsingleuser/:id", userController_1.getSingleUsers);
router.delete("/deleteuser/:id", userController_1.deleteUser);
router.patch("/updateuser/:id", userController_1.updateUser);
router.post('/forgot-password', passwordController_1.forgotPassword);
router.post('/reset-password', passwordController_1.resetPassword);
router.post("/verify-otp", passwordController_1.verifyOtp);
exports.default = router;
