//Express
import express from 'express';

//TestdriveController
import {  cancelTestdrive, countTestdrives, getAllTestDrives, getTestdrive, scheduleTestdrive, updateTestdrivestatus } from '../Controllers/testdriveController';
import verifytoken from '../Middleware/authantication';
import { getAllInspections } from 'src/Controllers/inspectionController';
const router = express.Router();

router.post('/scheduleTestDrive',verifytoken, scheduleTestdrive);
router.get('/allTestDrive',verifytoken, getAllTestDrives);
router.get('/Pendingcounttestdrive',verifytoken, countTestdrives);

router.delete('/cancelTestDrive/:id', verifytoken,cancelTestdrive);
router.patch('/updateTestDriveStatus/:id',verifytoken,updateTestdrivestatus);
router.get('/gettestdrive/:id',verifytoken,getTestdrive);


export default router;