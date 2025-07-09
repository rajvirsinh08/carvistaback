import express from "express";
// import { bookInspection } from "../Controllers/inspectionController";
import verifytoken from "../Middleware/authantication";
import { bookInspection, getInspectionDetail,cancelInspection, rescheduleInspection, getUserAppointments, getAllInspections, deleteInspectionByAdmin, ByAdminrescheduleInspection, countPendingInspections } from "../Controllers/inspectionController";
import isAdmin from "../Middleware/isAdmin";
import { uploadPDF } from "../Middleware/upload";

// import { bookInspection } from "../Controllers/inspectionController";

const router = express.Router();

router.post("/book", verifytoken, bookInspection); // Protected route
router.get("/getinspection/:inspectionId", verifytoken, getInspectionDetail);
router.delete("/cancelinspection/:inspectionId", verifytoken, cancelInspection);
router.patch("/rescheduleinspection/:inspectionId", verifytoken, rescheduleInspection);
router.patch("/ByAdminrescheduleinspection/:inspectionId", verifytoken,isAdmin, uploadPDF,ByAdminrescheduleInspection);

router.get("/appointments", verifytoken, getUserAppointments);
router.get("/allinspections", verifytoken,isAdmin, getAllInspections);
router.get("/countPendingInspections", countPendingInspections);

router.delete("/deleteinspection/:inspectionId", verifytoken,isAdmin, deleteInspectionByAdmin);



export default router;
