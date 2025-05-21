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
router.get('/get', protect, authorize('preparedBy', 'approvedBy'), getPayrolls);
router.put('/:id', protect, authorize('preparedBy'), updatePayroll);

export default router;
