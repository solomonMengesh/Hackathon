import express from 'express';
import { registerUser, loginUser ,logoutUser ,getMe } from '../controllers/authController.js';
import { uploadPDF } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

 router.post('/register', uploadPDF.single('cv'), registerUser);  
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe); 

export default router;
