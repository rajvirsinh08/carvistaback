import express from "express";
import { getAllSoldCars, getTotalCommission, sellCar } from "../Controllers/sellCarController";
import verifytoken from "../Middleware/authantication";
// import { sellCar } from "./controllers/sellCar";  // Assuming the controller file is named sellCar

const router = express.Router();

// Route to sell a car
router.patch("/sell/:carId",verifytoken, sellCar);
router.get("/allsoldcars",verifytoken, getAllSoldCars);
router.get("/totalCommission",verifytoken, getTotalCommission);



export default router;