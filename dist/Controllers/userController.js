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
exports.deleteUser = exports.updateUser = exports.getSingleUsers = exports.getAllUsers = exports.createUser = exports.signInUser = void 0;
//Express
const express_1 = __importDefault(require("express"));
//UserModel
const userModel_1 = __importDefault(require("../Model/userModel"));
//JwtWebToken
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Messages
const Messages_1 = require("../Constants/Messages");
const JWTSECRET = "your_jwt_secret_key";
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Login API
const signInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ error: Messages_1.Messages.InvalidEmail });
            return;
        }
        // const isMatch = await bcrypt.compare(password, user.password)/;
        if (user && password === user.password) {
            const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, JWTSECRET, {
                expiresIn: '10h'
            });
            res.status(200).json({ message: Messages_1.Messages.LoginSuccess, token });
            return;
        }
        else {
            res.status(401).json({ error: Messages_1.Messages.InvalidEmail });
            return;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
            return;
        }
    }
});
exports.signInUser = signInUser;
// Create User 
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, contact, password } = req.body;
        const user = new userModel_1.default({
            name,
            email,
            contact,
            password,
        });
        const savedUser = yield user.save();
        res.status(201).json(savedUser);
    }
    catch (error) {
        if (error instanceof Error)
            res.status(400).json({ error: error.message });
        return;
    }
});
exports.createUser = createUser;
// Get All Users 
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find();
        res.status(200).json(users);
    }
    catch (error) {
        if (error instanceof Error)
            res.status(400).json({ error: error.message });
        return;
    }
});
exports.getAllUsers = getAllUsers;
// Get User by ID 
const getSingleUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const singleUser = yield userModel_1.default.findById(id);
        if (singleUser) {
            res.status(200).json(singleUser);
            return;
        }
        else {
            res.status(404).json(Messages_1.Messages.UserNotFound);
            return;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
            return;
        }
        else {
            res.status(500).json({ error: Messages_1.Messages.UnknownError });
            return;
        }
    }
});
exports.getSingleUsers = getSingleUsers;
// Update User 
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updateUser = yield userModel_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json(updateUser);
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
    }
});
exports.updateUser = updateUser;
// Delete User 
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const singleUser = yield userModel_1.default.findByIdAndDelete(id);
        if (!singleUser) {
            res.status(404).json({ error: Messages_1.Messages.UserNotFound });
        }
        res.status(200).json(singleUser);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
    }
});
exports.deleteUser = deleteUser;
