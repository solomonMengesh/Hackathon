import express from 'express';
import {
  createEmployee,
 
} from '../controllers/employeeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/cre',protect, authorize('preparedBy', 'approvedBy'),  createEmployee);


export default router;
