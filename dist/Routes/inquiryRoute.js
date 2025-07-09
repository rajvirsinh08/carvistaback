"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Express
const express_1 = __importDefault(require("express"));
//InquiryController
const inquiryController_1 = require("../Controllers/inquiryController");
const router = express_1.default.Router();
router.post('/addinquiry', inquiryController_1.addInquiry);
router.get('/allinquiry', inquiryController_1.allInquiry);
router.delete('/deleteinquiry/:id', inquiryController_1.deleteInquiry);
router.patch('/updateinquiry/:id', inquiryController_1.updateInquiry);
router.get('/getinquiry/:id', inquiryController_1.getInquiry);
exports.default = router;
