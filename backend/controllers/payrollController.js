import PayrollRecord from '../models/Payroll.js';
import Employee from '../models/Employee.js';

const positionAllowances = {
  CEO: 2015.38,
  COO: 1500.00,
  CTO: 1500.00,
  CISO: 1200.00,
  Director: 1200.00,
  'Dept Lead': 800.00,
  'Normal Employee': 0.00
};

const transportAllowances = {
  CEO: 2220.00,
  COO: 2220.00,
  CTO: 2220.00,
  CISO: 2220.00,
  Director: 2220.00,
  'Dept Lead': 2220.00,
  'Normal Employee': 600.00
};

const calculateEthiopianIncomeTax = (taxableIncome) => {
  if (taxableIncome <= 600) return { tax: 0, deductibleFee: 0 };
  if (taxableIncome <= 1650) return { tax: taxableIncome * 0.10 - 60, deductibleFee: 60 };
  if (taxableIncome <= 3200) return { tax: taxableIncome * 0.15 - 142.5, deductibleFee: 142.5 };
  if (taxableIncome <= 5250) return { tax: taxableIncome * 0.20 - 302.5, deductibleFee: 302.5 };
  if (taxableIncome <= 7800) return { tax: taxableIncome * 0.25 - 565, deductibleFee: 565 };
  if (taxableIncome <= 10900) return { tax: taxableIncome * 0.30 - 955, deductibleFee: 955 };
  return { tax: taxableIncome * 0.35 - 1500, deductibleFee: 1500 };
};

const calculateDeductions = (taxableIncome, employeePosition) => {
  const { tax, deductibleFee } = calculateEthiopianIncomeTax(taxableIncome);
  const pensionRate = ['CEO', 'COO', 'CTO'].includes(employeePosition) ? 0.11 : 0.07;
  const pension = taxableIncome * pensionRate;
  return { tax, pension, deductibleFee };
};

export const createPayrollRecord = async (req, res) => {
  try {
    const { employeeId, workingDays, otherCommission = 0, preparedBy } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const earnedSalary = workingDays * (employee.basicSalary / 30);
    const positionAllowance = positionAllowances[employee.position] || 0;
    const transportAllowance = transportAllowances[employee.position] || 0;

    const taxablePositionAllowance = positionAllowance > (employee.basicSalary * 0.10) ? positionAllowance : 0;
    const taxableTransportAllowance = transportAllowance > (employee.basicSalary * 0.10) ? transportAllowance : 0;

    const grossPay = earnedSalary + positionAllowance + transportAllowance + otherCommission;
    const taxableIncome = earnedSalary + taxablePositionAllowance + taxableTransportAllowance + otherCommission;

    const deductions = calculateDeductions(taxableIncome, employee.position);
    const totalDeduction = deductions.tax + deductions.pension;
    const netPayment = grossPay - totalDeduction;

    const payrollRecord = new PayrollRecord({
      employee: employee._id,
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
    const records = await PayrollRecord.find({})
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
    if (!record) return res.status(404).json({ message: 'Payroll record not found' });
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
    if (!record) return res.status(404).json({ message: 'Payroll record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};