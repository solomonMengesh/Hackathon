import BankTransaction from '../models/Transaction.js';
import PayrollRecord from '../models/Payroll.js';
import Employee from '../models/Employee.js';

 export const processPayments = async (req, res) => {
  try {
    const { payrollIds } = req.body;  
    const session = await BankTransaction.startSession();
    session.startTransaction();

    try {
      for (const payrollId of payrollIds) {
        const payroll = await PayrollRecord.findById(payrollId).session(session);
        if (!payroll) throw new Error(`Payroll ${payrollId} not found`);
        if (payroll.status !== 'approved') throw new Error(`Payroll ${payrollId} not approved`);

        const employee = await Employee.findById(payroll.employee).session(session);
        if (!employee) throw new Error(`Employee ${payroll.employee} not found`);

        
        const paymentSuccess = true; 

        const transaction = new BankTransaction({
          payrollRecord: payroll._id,
          employee: employee._id,
          amount: payroll.netPayment,
          status: paymentSuccess ? 'success' : 'failed',
          failureReason: paymentSuccess ? null : 'Simulated failure',
        });

        await transaction.save({ session });

        if (!paymentSuccess) {
        
          throw new Error(`Payment failed for payroll ${payrollId}, rolling back`);
        }
      }

      await session.commitTransaction();
      session.endSession();
      res.json({ message: 'All payments processed successfully' });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: error.message });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
