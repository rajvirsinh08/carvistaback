"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const carController_1 = require("../Controllers/carController");
const upload_1 = require("../Middleware/upload");
const router = express_1.default.Router();
router.post("/caradd", upload_1.uploadMultiple, carController_1.addCar);
router.get("/allcars", carController_1.getCars);
router.get("/getcar/:id", carController_1.getCarById);
exports.default = router;
// //Express
// import express from "express";
// //Carcontroller
// import {
//   addCar,
//   allCars,
//   deleteCar,
//   getCar,
//   updateCar,
//   upload
// } from "../Controllers/carController"; 
// // import { upload } from "../Controllers/uploadimageController";
// const router = express.Router();
// router.post("/addcar", upload.single("image"), addCar);
// router.get("/allcars", allCars);
// router.delete("/deletecar/:id", deleteCar);
// router.patch("/updatecar/:id", updateCar);
// router.get("/getcar/:id", getCar);
// export default router;
