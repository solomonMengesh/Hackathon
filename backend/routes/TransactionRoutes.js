import express from 'express';
import {
  processPayments,

} from '../controllers/TransactionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/process', protect, authorize('approvedBy'), processPayments);
// router.get('/', protect, authorize('approvedBy'), getBankTransactions);

export default router;
