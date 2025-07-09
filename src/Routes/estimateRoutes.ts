import express from "express";
import { estimatePrice, getEstimateById } from "../Controllers/priceEstimateController";
import verifytoken from "../Middleware/authantication";
// import { verifytoken } from "../Middleware/authantication";

const router = express.Router();

router.post("/estimate", verifytoken, estimatePrice); // Protected route
router.get("/getsingleEstimate/:estimateCarId",verifytoken, getEstimateById);


export default router;
