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
exports.estimatePrice = void 0;
const EstimateCarModel_1 = __importDefault(require("../Model/EstimateCarModel")); // Import model
const estimatePrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log("🔹 User Object from Token:", req.user); // Debugging
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ error: "User authentication failed." });
            return;
        }
        // ✅ Declare userId
        const userId = req.user.id;
        const { brand, model, year, fuel, kmdriven, transmission, type } = req.body;
        if (!brand || !model || !year || !fuel || kmdriven === undefined || !transmission || !type) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }
        // ✅ Convert year & kmdriven to numbers
        const carYear = Number(year);
        const kmDrivenNum = Number(kmdriven);
        if (isNaN(carYear) || isNaN(kmDrivenNum) || kmDrivenNum < 0) {
            res.status(400).json({ error: "Invalid input values" });
            return;
        }
        // ✅ Base Price based on brand and model
        const basePrices = {
            "Honda Amaze": 700000,
            "Honda City": 900000,
            "Toyota Innova": 1200000,
            "Toyota Fortuner": 2500000,
            "Hyundai Creta": 1000000,
            "Ford Ecosport": 850000,
            "Kia Seltos": 1100000,
            "Skoda Kushaq": 1150000,
        };
        const basePrice = basePrices[`${brand} ${model}`] || 500000; // Default ₹5,00,000 if not found
        // ✅ Depreciation Calculation (7% per year)
        const currentYear = new Date().getFullYear();
        const carAge = currentYear - carYear;
        const depreciationRate = 0.07;
        let estimatedPrice = basePrice * Math.pow(1 - depreciationRate, carAge);
        // ✅ Apply fuel and transmission factors
        const fuelFactor = fuel === "Diesel" ? 1.05 : fuel === "Electric" ? 1.2 : fuel === "Hybrid" ? 1.15 : 1;
        const transmissionFactor = transmission === "Automatic" ? 1.1 : 1;
        estimatedPrice *= fuelFactor;
        estimatedPrice *= transmissionFactor;
        // ✅ Reduce price based on kilometers driven (₹20,000 per 20,000 km)
        estimatedPrice -= (kmDrivenNum / 20000) * 20000;
        // ✅ Ensure minimum price of ₹50,000
        estimatedPrice = Math.max(estimatedPrice, 50000);
        // ✅ Save to MongoDB
        const newEstimate = new EstimateCarModel_1.default({
            userId, // ✅ Now userId exists in scope
            brand,
            model,
            year: carYear,
            fuel,
            kmdriven: kmDrivenNum,
            transmission,
            type,
            estimatedPrice: Math.round(estimatedPrice),
        });
        // ✅ Save and store the result in `savedEstimate`
        const savedEstimate = yield newEstimate.save();
        // ✅ Return both `estimateCarId` and `estimatedPrice`
        res.json({
            estimateCarId: savedEstimate._id,
            estimatedPrice: savedEstimate.estimatedPrice, // ✅ Include estimated price
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: "Server error", details: err.message });
    }
});
exports.estimatePrice = estimatePrice;
// import { Request, Response } from "express";
// export const estimatePrice = async (req: Request, res: Response) => {
//   try {
//     console.log("Received Data:", req.body);
//     const { brand, model, year, fuel, kmdriven, transmission, type } = req.body;
//     // ✅ Validate Input
//     if (!brand || !model || !year || !fuel || kmdriven === undefined || !transmission || !type) {
//       res.status(400).json({ error: "All fields are required" });
//       return;
//     }
//     // ✅ Convert year to a number
//     const carYear = Number(year);
//     if (isNaN(carYear)) {
//       res.status(400).json({ error: "Invalid year format" });
//       return;
//     }
//     // ✅ Convert kmdriven to a number and validate
//     const kmDrivenNum = Number(kmdriven);
//     if (isNaN(kmDrivenNum) || kmDrivenNum < 0) {
//       res.status(400).json({ error: "Invalid km driven value" });
//       return;
//     }
//     // ✅ Base Price based on brand and model
//     const basePrices: Record<string, number> = {
//       "Honda Amaze": 700000,
//       "Honda City": 900000,
//       "Toyota Innova": 1200000,
//       "Toyota Fortuner": 2500000,
//       "Hyundai Creta": 1000000,
//       "Ford Ecosport": 850000,
//       "Kia Seltos": 1100000,
//       "Skoda Kushaq": 1150000,
//     };
//     const basePrice = basePrices[`${brand} ${model}`] || 500000; // Default ₹5,00,000 if not found
//     // ✅ Depreciation Calculation (7% per year)
//     const currentYear = new Date().getFullYear();
//     const carAge = currentYear - carYear;
//     const depreciationRate = 0.07;
//     let estimatedPrice = basePrice * Math.pow(1 - depreciationRate, carAge);
//     // ✅ Apply fuel and transmission factors
//     const fuelFactor = fuel === "Diesel" ? 1.05 : fuel === "Electric" ? 1.2 : fuel === "Hybrid" ? 1.15 : 1;
//     const transmissionFactor = transmission === "Automatic" ? 1.1 : 1;
//     estimatedPrice *= fuelFactor;
//     estimatedPrice *= transmissionFactor;
//     // ✅ Reduce price based on kilometers driven (₹20,000 per 20,000 km)
//     estimatedPrice -= (kmDrivenNum / 20000) * 20000;
//     // ✅ Ensure minimum price of ₹50,000
//     estimatedPrice = Math.max(estimatedPrice, 50000);
//     res.json({
//       brand,
//       model,
//       year: carYear,
//       kmdriven: kmDrivenNum,
//       estimatedPrice: Math.round(estimatedPrice),
//     });
//   } catch (error: unknown) {
//     const err = error as Error;
//     res.status(500).json({ error: "Server error", details: err.message });
//   }
// };
