import mongoose from 'mongoose';

const bankTransactionSchema = new mongoose.Schema({
  payrollRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'Payroll', required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  transactionDate: { type: Date, default: Date.now },
  failureReason: { type: String, default: null }
}, { timestamps: true });

const BankTransaction = mongoose.model('BankTransaction', bankTransactionSchema);
export default BankTransaction;
