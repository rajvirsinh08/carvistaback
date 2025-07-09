"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Express
const express_1 = __importDefault(require("express"));
//Cors
const cors_1 = __importDefault(require("cors"));
//Dotenv
const dotenv_1 = __importDefault(require("dotenv"));
//Mongoose
const mongoose_1 = __importDefault(require("mongoose"));
//UserRoutes
const userRoutes_1 = __importDefault(require("./Routes/userRoutes"));
//carRoutes
const carRoutes_1 = __importDefault(require("./Routes/carRoutes"));
const estimateRoutes_1 = __importDefault(require("./Routes/estimateRoutes"));
const inspectionRoutes_1 = __importDefault(require("./Routes/inspectionRoutes"));
const testdriveRoutes_1 = __importDefault(require("./Routes/testdriveRoutes"));
// import imageuploadRoute from "./Routes/uploadimageRoutes";
//TestdriveRoutes
// import testdriveRoute from './Routes/testdriveRoutes';
//InspectionRoutes
// import inspectionRoute from './Routes/inspectionRoutes';
//InquiryRoutes
const inquiryRoute_1 = __importDefault(require("./Routes/inquiryRoute"));
//UploadImage
// import imageuploadRoute from './Routes/uploadimageRoutes'
// import imageuploadRoute from "./Routes/uploadimageRoutes";
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 9000;
const URI = process.env.URI || "6000";
app.use((0, cors_1.default)());
app.use(express_1.default.json());
mongoose_1.default.connect(process.env.URI || "").then(() => {
    console.log("Connected Successfully");
    app.listen(process.env.PORT || 8000, () => {
        console.log("Running Successfully at", process.env.PORT);
    });
    app.use("/uploads", express_1.default.static("uploads"));
    // API Routes
    // app.use("/testdrive",testdrive);
    app.use("/inspection", inspectionRoutes_1.default);
    // app.use("/upload",imageuploadRoute)
});
app.use("/user", userRoutes_1.default);
app.use("/car", carRoutes_1.default);
app.use("/testdrive", testdriveRoutes_1.default);
app.use("/inquiry", inquiryRoute_1.default);
// app.use("/upload", imageuploadRoute);
app.use("/estimateroute", estimateRoutes_1.default);
app.use("/inspection", inspectionRoutes_1.default);
