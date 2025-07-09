"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Express
const express_1 = __importDefault(require("express"));
//TestdriveController
const testdriveController_1 = require("../Controllers/testdriveController");
const router = express_1.default.Router();
router.post('/scheduleTestDrive', testdriveController_1.scheduleTestdrive);
router.get('/allTestDrive', testdriveController_1.allTestdrive);
router.delete('/cancelTestDrive/:id', testdriveController_1.cancelTestdrive);
router.patch('/updateTestDriveStatus/:id', testdriveController_1.updateTestdrivestatus);
router.get('/getTestdrive/:id', testdriveController_1.getTestdrive);
exports.default = router;
