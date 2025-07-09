import express from "express";
import { addCar, deleteCar, duplicate, getCarById, getCarInfo, getCars, getCountTotalCars, updateCar } from "../Controllers/carController";
import {  searchCar } from "../Controllers/carController";
import { uploadMultiple } from "../Middleware/upload";

const router = express.Router();

router.post("/caradd", uploadMultiple, addCar); 
router.get("/allcars", getCars);
router.get("/countcars", getCountTotalCars);
router.patch("/updatecar/:id", updateCar);


router.get("/getcar/:id", getCarById); 
router.delete("/deletecar/:id", deleteCar); // Route for deleting a car
router.get("/search",searchCar); // Search
router.post("/duplicate", uploadMultiple,duplicate);

// router.post('/regcar/:regNumber', getCarInfo);

router.post("/duplicate", uploadMultiple,duplicate);
export default router;