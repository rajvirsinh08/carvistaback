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
exports.getInquiry = exports.updateInquiry = exports.deleteInquiry = exports.allInquiry = exports.addInquiry = void 0;
//Express
const express_1 = __importDefault(require("express"));
//InquiryModel
const inquiryModel_1 = __importDefault(require("../Model/inquiryModel"));
//Messages
const Messages_1 = require("../Constants/Messages");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Schedule a test drive
const addInquiry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carId, userId, date, status } = req.body;
        const addInquiry = yield inquiryModel_1.default.create({
            carId,
            userId,
            date,
            status
        });
        res
            .status(200)
            .json({ message: Messages_1.Messages.inquiryAdded, addInquiry });
    }
    catch (error) {
        res.status(500).json({ error: Messages_1.Messages.inquiryFailed });
        return;
    }
});
exports.addInquiry = addInquiry;
// Get all test drives
const allInquiry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getInquiry = yield inquiryModel_1.default.find().populate("carId userId");
        res.status(200).json(getInquiry);
    }
    catch (error) {
        res.status(500).json({ error: Messages_1.Messages.inquiryFailed });
        return;
    }
});
exports.allInquiry = allInquiry;
// Cancel a test drive
const deleteInquiry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleteInquiry = yield inquiryModel_1.default.findByIdAndDelete(id);
        if (!deleteInquiry) {
            res.status(404).json({ error: Messages_1.Messages.inquiryNotFound });
            return;
        }
        res.status(200).json({ message: Messages_1.Messages.inquiryDeleted, deleteInquiry });
    }
    catch (error) {
        res.status(500).json({ error: Messages_1.Messages.inquiryCancelFailed });
        return;
    }
});
exports.deleteInquiry = deleteInquiry;
// Update test drive status
const updateInquiry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedInquiry = yield inquiryModel_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedInquiry) {
            res.status(404).json({ error: Messages_1.Messages.inquiryNotFound });
            return;
        }
        res
            .status(200)
            .json({ message: Messages_1.Messages.inquiryUpdated, updatedInquiry });
    }
    catch (error) {
        res.status(500).json({ error: Messages_1.Messages.inquiryUpdateFailed });
        return;
    }
});
exports.updateInquiry = updateInquiry;
//Get the Inquiry By id
const getInquiry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const getInquiry = yield inquiryModel_1.default.findById(id);
        if (!getInquiry) {
            res.status(200).json(getInquiry);
            return;
        }
        else {
            res.status(404).json(Messages_1.Messages.CarNotFound);
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
exports.getInquiry = getInquiry;
