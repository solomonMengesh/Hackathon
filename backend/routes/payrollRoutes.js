import express from 'express';
import {
  createPayrollRecord as createPayroll,
  getPayrollRecords as getPayrolls,
  getPayrollById,
  updatePayrollRecord as updatePayroll,
  approvePayrollRecord as approvePayroll,
} from '../controllers/payrollController.js';


import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

  router.post('/', protect, authorize('preparedBy'), createPayroll);


export default router;
