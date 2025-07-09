// routes/contactRoutes.ts
import { Router } from 'express';
import { deleteContact, getAllContacts, submitContactForm } from '../Controllers/contactUsController';
import verifytoken from '../Middleware/authantication';
import isAdmin from '../Middleware/isAdmin';
// import { submitContactForm } from '../controllers/contactController';

const router: Router = Router();

router.post('/submit', submitContactForm);
router.get('/getContectus',verifytoken,isAdmin, getAllContacts);
router.delete('/deleteContectus/:id',verifytoken,isAdmin, deleteContact);



export default router;