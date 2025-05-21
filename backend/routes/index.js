import express from 'express';
 import employeeRoutes from './employeeRoutes.js';
import payrollRoutes from './payrollRoutes.js';
import bankTransactionRoutes from './TransactionRoutes.js';

const router = express.Router();

 router.use('/employees', employeeRoutes);
router.use('/payroll', payrollRoutes);
router.use('/bank-transactions', bankTransactionRoutes);

export default router;
