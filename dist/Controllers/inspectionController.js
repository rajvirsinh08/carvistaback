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
exports.cancelInspection = exports.getInspectionDetail = exports.bookInspection = void 0;
const inspectionModel_1 = __importDefault(require("../Model/inspectionModel"));
const EstimateCarModel_1 = __importDefault(require("../Model/EstimateCarModel")); // Using your provided model
const bookInspection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ error: "User authentication failed." });
            return;
        }
        const { carId, inspectionDate, location } = req.body;
        if (!carId || !inspectionDate || !location) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }
        // Ensure the car exists in EstimateModel
        const carExists = yield EstimateCarModel_1.default.findById(carId);
        if (!carExists) {
            res.status(404).json({ error: "Car not found in Estimate database" });
            return;
        }
        // Prevent duplicate bookings for the same car
        const existingBooking = yield inspectionModel_1.default.findOne({
            userId: req.user.id,
            carId,
        });
        if (existingBooking) {
            res.status(400).json({ error: "Inspection already booked for this car." });
            return;
        }
        // Format inspection date to store only YYYY-MM-DD as a string
        const inspectionDateFormatted = new Date(inspectionDate).toISOString().split("T")[0];
        // Save booking
        const newInspection = new inspectionModel_1.default({
            userId: req.user.id,
            carId,
            inspectionDate: inspectionDateFormatted, // ✅ Now stored as a String, not Date
            location,
        });
        yield newInspection.save();
        res.json({
            message: "Inspection booked successfully",
            inspectionId: newInspection._id,
            inspection: newInspection,
        });
    }
    catch (error) {
        console.error("Inspection Booking Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});
exports.bookInspection = bookInspection;
const getInspectionDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ error: "User authentication failed." });
            return;
        }
        const { inspectionId } = req.params;
        if (!inspectionId) {
            res.status(400).json({ error: "Inspection ID is required" });
            return;
        }
        // Find the inspection and populate car details
        const inspection = yield inspectionModel_1.default.findById(inspectionId).populate("carId");
        if (!inspection) {
            res.status(404).json({ error: "Inspection not found" });
            return;
        }
        res.json({
            message: "Inspection details retrieved successfully",
            inspection
        });
    }
    catch (error) {
        console.error("Get Inspection Detail Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});
exports.getInspectionDetail = getInspectionDetail;
const cancelInspection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ error: "User authentication failed." });
            return;
        }
        const { inspectionId } = req.params;
        if (!inspectionId) {
            res.status(400).json({ error: "Inspection ID is required" });
            return;
        }
        // Find the inspection
        const inspection = yield inspectionModel_1.default.findOne({
            _id: inspectionId,
            userId: req.user.id,
        });
        if (!inspection) {
            res.status(404).json({ error: "Inspection not found or unauthorized" });
            return;
        }
        // Delete the inspection
        yield inspectionModel_1.default.findByIdAndDelete(inspectionId);
        res.json({ message: "Inspection canceled successfully" });
    }
    catch (error) {
        console.error("Cancel Inspection Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});
exports.cancelInspection = cancelInspection;
