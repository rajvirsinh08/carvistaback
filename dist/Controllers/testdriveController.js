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
exports.getTestdrive = exports.updateTestdrivestatus = exports.cancelTestdrive = exports.allTestdrive = exports.scheduleTestdrive = void 0;
//testdriveModel
const testdriveModel_1 = __importDefault(require("../Model/testdriveModel"));
//Messages
const Messages_1 = require("../Constants/Messages");
// Schedule a test drive
const scheduleTestdrive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carId, userId, date } = req.body;
        const testDrive = yield testdriveModel_1.default.create({
            carId,
            userId,
            date,
            status: "pending",
        });
        res
            .status(200)
            .json({ message: Messages_1.Messages.testdriveSchedule, testDrive });
    }
    catch (error) {
        res.status(500).json({ error: Messages_1.Messages.failTestDrive });
        return;
    }
});
exports.scheduleTestdrive = scheduleTestdrive;
// Get all test drives
const allTestdrive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const testDrives = yield testdriveModel_1.default.find().populate("carId userId");
        res.status(200).json(testDrives);
    }
    catch (error) {
        res.status(500).json({ error: Messages_1.Messages.failFetchTestdrive });
        return;
    }
});
exports.allTestdrive = allTestdrive;
// Cancel a test drive
const cancelTestdrive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleteTestdrive = yield testdriveModel_1.default.findByIdAndDelete(id);
        if (!deleteTestdrive) {
            res.status(404).json({ error: Messages_1.Messages.testdriveNotFound });
            return;
        }
        res.status(200).json({ message: Messages_1.Messages.testdriveCancel, deleteTestdrive });
    }
    catch (error) {
        res.status(500).json({ error: Messages_1.Messages.failtestdriveCancel });
        return;
    }
});
exports.cancelTestdrive = cancelTestdrive;
// Update test drive status
const updateTestdrivestatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedTestdrive = yield testdriveModel_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedTestdrive) {
            res.status(404).json({ error: Messages_1.Messages.testdriveNotFound });
            return;
        }
        res
            .status(200)
            .json({ message: Messages_1.Messages.updatedTestDrive, updatedTestdrive });
    }
    catch (error) {
        res.status(500).json({ error: Messages_1.Messages.failtestdriveUpdate });
        return;
    }
});
exports.updateTestdrivestatus = updateTestdrivestatus;
//Get the Inspection By Id
const getTestdrive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const getTestdrive = yield testdriveModel_1.default.findById(id);
        if (!getTestdrive) {
            res.status(200).json(getTestdrive);
            return;
        }
        else {
            res.status(404).json(Messages_1.Messages.TestdriveNotFound);
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
exports.getTestdrive = getTestdrive;
