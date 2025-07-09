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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCarById = exports.getCars = exports.addCar = void 0;
const carModel_1 = require("../Model/carModel");
// 🟢 Add a new car
const addCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const { model, brand, year, price, status, kmdriven, fueltype, transmission, type } = req.body;
        if (!model || !brand || !year || !price || !status || !kmdriven || !fueltype || !transmission || !type || !req.files) {
            res.status(400).json({ message: "All fields and images are required" });
            return;
        }
        // Extract uploaded file paths
        const files = req.files;
        const exteriorimage = ((_b = (_a = files["exteriorimage"]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path) || "";
        const interiorimage = ((_d = (_c = files["interiorimage"]) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.path) || "";
        const tyreimage = ((_f = (_e = files["tyreimage"]) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.path) || "";
        // Create a new car entry
        const newCar = new carModel_1.Car({
            model,
            brand,
            year,
            price,
            status,
            kmdriven,
            fueltype,
            transmission,
            type,
            exteriorimage,
            interiorimage,
            tyreimage
        });
        yield newCar.save();
        res.status(201).json({ message: "Car added successfully", car: newCar });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
exports.addCar = addCar;
// 🟢 Get all cars
const getCars = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cars = yield carModel_1.Car.find();
        res.json(cars);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
exports.getCars = getCars;
// 🟢 Get car by ID
const getCarById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const car = yield carModel_1.Car.findById(req.params.id);
        if (!car) {
            res.status(404).json({ message: "Car not found" });
            return;
        }
        res.json(car);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
exports.getCarById = getCarById;
// import { Request, Response } from "express";
// import { Car } from "../Model/carModel";
// // import { Car } from "../Models/carModel";
// export const addCar = async (req: Request, res: Response) => {
//   try {
//     const { brand, model, name } = req.body;
//     if (!brand || !model || !name || !req.file) {
//        res.status(400).json({ message: "All fields are required" });
//        return
//     }
//     const newCar = new Car({
//       brand,
//       model,
//       name,
//       image: `/uploads/${req.file.filename}`,
//     });
//     await newCar.save();
//     res.status(201).json({ message: "Car added successfully", car: newCar });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: (error as Error).message });
//   }
// };
// export const getCars = async (_req: Request, res: Response) => {
//   try {
//     const cars = await Car.find();
//     res.json(cars);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: (error as Error).message });
//   }
// };
// export const getCarById = async (req: Request, res: Response) => {
//   try {
//     const car = await Car.findById(req.params.id);
//     if (!car) return res.status(404).json({ message: "Car not found" });
//     res.json(car);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: (error as Error).message });
//   }
// };
// import express, { Request, Response } from "express";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import Car from "../Model/carModel";
// import { Messages } from "../Constants/Messages";
// const app = express();
// // ✅ FIX: Remove express.json() here, because it breaks form-data handling
// // Ensure upload directory exists
// const uploadDir = path.join(__dirname, "../../upload");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }
// // ✅ Fix: Make sure `cb` function has the correct type `(error: Error | null, filename: string) => void`
// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (_req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// export const upload = multer({
//   storage: storage,
//   limits: {
//       fileSize: 1024 * 1024 * 20, // 5MB limit
//       files: 1, // Only allow 1 file
//   },
// });
// // ✅ Move express.json() **AFTER** multer, so it doesn’t interfere with `multipart/form-data`
// app.use(express.json());
// // 📌 Add Car API with Image Upload
// export const addCar = async (req: Request, res: Response): Promise<void> => {
//   try {
//     console.log("Received file:", req.file);
//     console.log("Received body:", req.body);
//     // ✅ Fix: Check if `req.file` exists properly
//     if (!req.file) {
//      res.status(400).json({ message: "No file uploaded" });
//      return ;
//     }
//     const { model, manufacturer, year, price, status, kmdriven, fueltype, transmission } = req.body;
//     if (!model || !manufacturer || !year || !price || !status || !fueltype || !transmission || !kmdriven) {
//       res.status(400).json({ message: "All fields are required" });
//       return;
//     }
//     const newCar = new Car({
//       model,
//       manufacturer,
//       year,
//       price,
//       status,
//       kmdriven,
//       fueltype,
//       transmission,
//       image: `/upload/${req.file.filename}`,
//     });
//     await newCar.save();
//     res.status(201).json({ message: "Car added successfully", car: newCar });
//   } catch (error) {
//     console.error("Error in addCar:", error);
//     res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
//   }
// };
// // Get file by ID (filename)
// export const getFile = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const filename = req.params.filename;
//     const imagePath = path.join(uploadDir, filename);
//     if (fs.existsSync(imagePath)) {
//       res.sendFile(imagePath);
//     } else {
//       res.status(404).json({ message: Messages.FileNotFound });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error instanceof Error ? error.message : Messages.ServerError });
//   }
// };
// // Get All Cars
// export const allCars = async (req: Request, res: Response) => {
//   try {
//     const cars = await Car.find();
//     res.status(200).json(cars);
//   } catch (error) {
//     if(error instanceof Error)
//     res.status(400).json({ error: error.message });
//     return;
//   }
// };
// // Update Car
// export const updateCar = async (req: Request, res: Response) => {
//   const { id } = req.params;
//     try {
//       const updateCar = await Car.findByIdAndUpdate(id, req.body, {
//         new: true,
//       });
//       res.status(200).json(updateCar);
//     } catch (error) {
//       console.log(error);
//       if (error instanceof Error) {
//         res.status(500).json({ error: error.message });
//         return;
//       }
//     }
//   };
// //  Delete car 
// export const deleteCar = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//       const deleteCar = await Car.findByIdAndDelete(id);
//       if (!deleteCar) {
//         res.status(404).json({ error:Messages.carNotFound });
//         return;
//       }
//       res.status(200).json({message: Messages.carDeleted,deleteCar});
//     } catch (error) {
//       if (error instanceof Error) {
//         res.status(500).json({ error: error.message });
//         return;
//       }
//     }
//   };
//   //Get the car by id
//   export const getCar = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//       const getCar = await Car.findById(id);
//       if (getCar) {
//         res.status(200).json(getCar);
//         return;
//       } else {
//         res.status(404).json(Messages.CarNotFound);
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
