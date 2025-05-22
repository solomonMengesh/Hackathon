 import PDFDocument from 'pdfkit';

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
 

 

export const generatePayrollExcelReport = async (req, res) => {
  try {
    const { id } = req.params;

    const payroll = await PayrollRecord.findById(id).populate('employee');
    if (!payroll) return res.status(404).json({ message: 'Payroll record not found' });

    const doc = new PDFDocument({ margin: 50 });

    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=payroll-${payroll.employee.name}-${payroll.month}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20).text('Payroll Report', { align: 'center' });
    doc.moveDown();

    const addRow = (label, value) => {
      doc.fontSize(12).text(`${label}: ${value}`);
    };

    addRow('Employee Name', payroll.employee.name);
    addRow('Gender', payroll.employee.gender);
    addRow('Position', payroll.employee.position);
    addRow('Month', payroll.month);
    addRow('Working Days', payroll.workingDays);
    addRow('Basic Salary', payroll.employee.basicSalary);
    addRow('Earned Salary', payroll.earnedSalary);
    addRow('Position Allowance', payroll.positionAllowance);
    addRow('Transport Allowance', payroll.transportAllowance);
    addRow('Other Commission', payroll.otherCommission);
    addRow('Gross Pay', payroll.grossPay);
    addRow('Taxable Income', payroll.taxableIncome);
    addRow('Tax', payroll.deductions.tax);
    addRow('Pension', payroll.deductions.pension);
    addRow('Total Deduction', payroll.totalDeduction);
    addRow('Net Payment', payroll.netPayment);
    addRow('Prepared By', payroll.preparedBy);
    addRow('Status', payroll.status);

    doc.end();

  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ message: 'Error generating PDF report', error: err.message });
  }
};

