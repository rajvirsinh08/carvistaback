"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { bookInspection } from "../Controllers/inspectionController";
const authantication_1 = __importDefault(require("../Middleware/authantication"));
const inspectionController_1 = require("../Controllers/inspectionController");
// import { bookInspection } from "../Controllers/inspectionController";
const router = express_1.default.Router();
router.post("/book", authantication_1.default, inspectionController_1.bookInspection); // Protected route
router.get("/getinspection/:inspectionId", authantication_1.default, inspectionController_1.getInspectionDetail);
router.delete("/cancelinspection/:inspectionId", authantication_1.default, inspectionController_1.cancelInspection);
exports.default = router;
