import express from 'express';
import {
  createPayrollRecord as createPayroll,
  getPayrollRecords as getPayrolls,
    approvePayrollRecord as approvePayroll,
  generatePayrollExcelReport 
 } from '../controllers/payrollController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

 
 router.post('/', protect, authorize('preparedBy'), createPayroll);

 router.get('/get', protect, authorize('preparedBy', 'approvedBy'), getPayrolls);

 router.put('/approve/:id', protect, authorize('approvedBy'), approvePayroll);
router.get('/:id/excel', protect, authorize('preparedBy', 'approvedBy'), generatePayrollExcelReport);

export default router;
