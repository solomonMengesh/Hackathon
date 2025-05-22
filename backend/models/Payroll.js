import mongoose from 'mongoose';

const payrollRecordSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: { type: String,  },  
  workingDays: { type: Number, required: true },
  earnedSalary: { type: Number, required: true },
  positionAllowance: { type: Number, required: true },
  transportAllowance: { type: Number, default: 0 },
  otherCommission: { type: Number, default: 0 },
  grossPay: { type: Number, required: true },
  taxableIncome: { type: Number, required: true },
  deductions: {
    tax: { type: Number, required: true },
    pension: { type: Number, required: true },
  },
  totalDeduction: { type: Number, required: true },
  netPayment: { type: Number, required: true },
  preparedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['prepared', 'approved'], default: 'prepared' }
}, { timestamps: true });

const PayrollRecord = mongoose.model('PayrollRecord', payrollRecordSchema);
export default PayrollRecord;
