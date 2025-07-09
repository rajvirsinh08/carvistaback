"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const priceEstimateController_1 = require("../Controllers/priceEstimateController");
const authantication_1 = __importDefault(require("../Middleware/authantication"));
// import { verifytoken } from "../Middleware/authantication";
const router = express_1.default.Router();
router.post("/estimate", authantication_1.default, priceEstimateController_1.estimatePrice); // Protected route
exports.default = router;
