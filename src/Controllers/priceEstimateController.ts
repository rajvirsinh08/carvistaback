import { Request, Response } from "express";
import Estimate from "../Model/EstimateCarModel"; // Import model
import mongoose from "mongoose";

export const estimatePrice = async (req: Request, res: Response) => {
  try {
    console.log("🔹 User Object from Token:", req.user); // Debugging
    
    if (!req.user?.id) {
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
    const basePrices: Record<string, number> = {
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
    const newEstimate = new Estimate({
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
    const savedEstimate = await newEstimate.save();
    // ✅ Return both `estimateCarId` and `estimatedPrice`
    res.json({
      estimateCarId: savedEstimate._id,
      estimatedPrice: savedEstimate.estimatedPrice, // ✅ Include estimated price
    });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// GET API for fetching estimate car data by estimateCarId
export const getEstimateById = async (req: Request, res: Response) => {
  try {
    const { estimateCarId } = req.params; // Get estimateCarId from route parameters

    // Check if the estimateCarId is valid
    if (!mongoose.Types.ObjectId.isValid(estimateCarId)) {
       res.status(400).json({ error: "Invalid EstimateCarId" });
       return;
    }

    // Find the estimate by its ID
    const estimate = await Estimate.findById(estimateCarId).exec();

    if (!estimate) {
       res.status(404).json({ error: "Estimate not found" });
       return;
    }

    // Return the found estimate
    res.json({
      estimateCarId: estimate._id,
      brand: estimate.brand,
      model: estimate.model,
      year: estimate.year,
      fuel: estimate.fuel,
      kmdriven: estimate.kmdriven,
      transmission: estimate.transmission,
      type: estimate.type,
      estimatedPrice: estimate.estimatedPrice,
      createdAt: estimate.createdAt,
    });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ error: "Server error", details: err.message });
  }
};