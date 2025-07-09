//Express
import express from 'express';

//InquiryController
import { addInquiry, allInquiry, deleteInquiry, getInquiry, updateInquiry } from '../Controllers/inquiryController';

const router = express.Router();

router.post('/addinquiry', addInquiry);
router.get('/allinquiry', allInquiry);
router.delete('/deleteinquiry/:id', deleteInquiry);
router.patch('/updateinquiry/:id',updateInquiry);
router.get('/getinquiry/:id',getInquiry);


export default router;
// jrfrjehjrehf
// Rfrjgfurhf