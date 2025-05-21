import express from 'express';
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/cre',protect, authorize('preparedBy', 'approvedBy'),  createEmployee);
router.get('/', protect, authorize('preparedBy', 'approvedBy'), getEmployees);
router.get('/:id', protect, authorize('preparedBy', 'approvedBy'), getEmployeeById);
router.put('/:id', protect, authorize('preparedBy'), updateEmployee);
router.delete('/:id', protect, authorize('preparedBy'), deleteEmployee);

export default router;
