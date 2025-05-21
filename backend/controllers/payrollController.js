import PayrollRecord from '../models/Payroll.js';
import Employee from '../models/Employee.js';

const positionAllowanceRates = {
  CEO: 0.10,     
  COO: 0.07,
  CTO: 0.07,
  CISO: 0.05,
  Director: 0.05,
  'Dept Lead': 0.03,
  'Normal Employee': 0.0
};

const calculateEthiopianIncomeTax = (taxableIncome) => {
  if (taxableIncome <= 600) {
    return { tax: 0, deductibleFee: 0 };
  } else if (taxableIncome <= 1650) {
    return { tax: taxableIncome * 0.10 - 60, deductibleFee: 60 };
  } else if (taxableIncome <= 3200) {
    return { tax: taxableIncome * 0.15 - 142.5, deductibleFee: 142.5 };
  } else if (taxableIncome <= 5250) {
    return { tax: taxableIncome * 0.20 - 302.5, deductibleFee: 302.5 };
  } else if (taxableIncome <= 7800) {
    return { tax: taxableIncome * 0.25 - 565, deductibleFee: 565 };
  } else if (taxableIncome <= 10900) {
    return { tax: taxableIncome * 0.30 - 955, deductibleFee: 955 };
  } else {
    return { tax: taxableIncome * 0.35 - 1500, deductibleFee: 1500 };
  }
};

const calculateDeductions = (taxableIncome) => {
  const { tax, deductibleFee } = calculateEthiopianIncomeTax(taxableIncome);
  const pension = taxableIncome * 0.07;
  return { tax, pension, deductibleFee };
};

export const createPayrollRecord = async (req, res) => {
  try {
    const { employeeId, month, workingDays, positionAllowance, transportAllowance = 0, otherCommission = 0, preparedBy } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const earnedSalary = workingDays * (employee.basicSalary / 30);

    const taxablePositionAllowance = employee.position === 'CEO' ? positionAllowance : 0;
    const taxableTransportAllowance = transportAllowance * 0.5;

    const grossPay = earnedSalary + positionAllowance + transportAllowance + otherCommission;
    const taxableIncome = earnedSalary + taxablePositionAllowance + taxableTransportAllowance + otherCommission;

    const deductions = calculateDeductions(taxableIncome);
    const totalDeduction = deductions.tax + deductions.pension;
    const netPayment = grossPay - totalDeduction;

    const payrollRecord = new PayrollRecord({
      employee: employee._id,
      month,
      workingDays,
      earnedSalary,
      positionAllowance,
      transportAllowance,
      otherCommission,
      grossPay,
      taxableIncome,
      deductions,
      totalDeduction,
      netPayment,
      preparedBy,
      status: 'prepared'
    });

    await payrollRecord.save();
    res.status(201).json(payrollRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPayrollRecords = async (req, res) => {
  try {
    const { month } = req.query;
    const filter = month ? { month } : {};
    const records = await PayrollRecord.find(filter)
      .populate('employee')
      .populate('preparedBy', 'username role')
      .populate('approvedBy', 'username role');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approvePayrollRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body; 
    const record = await PayrollRecord.findById(id);
    if (!record) return res.status(404).json({ message: 'Payroll record not found' });

    if (record.status === 'approved') return res.status(400).json({ message: 'Already approved' });

    record.status = 'approved';
    record.approvedBy = approvedBy;
    await record.save();

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPayrollById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await PayrollRecord.findById(id)
      .populate('employee')
      .populate('preparedBy', 'username role')
      .populate('approvedBy', 'username role');

    if (!record) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }


    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePayrollRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const record = await PayrollRecord.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!record) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
