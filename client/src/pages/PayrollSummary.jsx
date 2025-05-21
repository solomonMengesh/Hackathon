const PayrollSummary = ({ payrollData }) => {
  return (
    <div className="glass-card p-6 md:p-8 shadow-lg">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
        Payroll Summary
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-700 dark:text-slate-300">
          <tbody>
            <tr className="border-b dark:border-gray-700">
              <td className="px-4 py-3 font-medium">Employee ID</td>
              <td className="px-4 py-3">{payrollData.employee}</td>
            </tr>
            <tr className="border-b dark:border-gray-700">
              <td className="px-4 py-3 font-medium">Month</td>
              <td className="px-4 py-3">{payrollData.month}</td>
            </tr>
            <tr className="border-b dark:border-gray-700">
              <td className="px-4 py-3 font-medium">Working Days</td>
              <td className="px-4 py-3">{payrollData.workingDays}</td>
            </tr>
            <tr className="border-b dark:border-gray-700">
              <td className="px-4 py-3 font-medium">Earned Salary</td>
              <td className="px-4 py-3">${payrollData.earnedSalary.toFixed(2)}</td>
            </tr>
            <tr className="border-b dark:border-gray-700">
              <td className="px-4 py-3 font-medium">Position Allowance</td>
              <td className="px-4 py-3">${payrollData.positionAllowance.toFixed(2)}</td>
            </tr>
            <tr className="border-b dark:border-gray-700">
              <td className="px-4 py-3 font-medium">Transport Allowance</td>
              <td className="px-4 py-3">${payrollData.transportAllowance.toFixed(2)}</td>
            </tr>
            <tr className="border-b dark:border-gray-700">
              <td className="px-4 py-3 font-medium">Other Commission</td>
              <td className="px-4 py-3">${payrollData.otherCommission.toFixed(2)}</td>
            </tr>
            <tr className="border-b dark:border-gray-700">
              <td className="px-4 py-3 font-medium">Gross Pay</td>
              <td className="px-4 py-3">${payrollData.grossPay.toFixed(2)}</td>
            </tr>
            <tr className="border-b dark:border-gray-700">
              <td className="px-4 py-3 font-medium">Taxable Income</td>
              <td className="px-4 py-3">${payrollData.taxableIncome.toFixed(2)}</td>
            </tr>
            <tr className="border-b dark:border-gray-700">
              <td className="px-4 py-3 font-medium">Tax Deduction</td>
              <td className="px-4 py-3">${payrollData.deductions.tax.toFixed(2)}</td>
            </tr>
            <tr className="border-b dark:border-gray-700">
              <td className="px-4 py-3 font-medium">Pension Deduction</td>
              <td className="px-4 py-3">${payrollData.deductions.pension.toFixed(2)}</td>
            </tr>
            <tr className="border-b dark:border-gray-700">
              <td className="px-4 py-3 font-medium">Total Deduction</td>
              <td className="px-4 py-3">${payrollData.totalDeduction.toFixed(2)}</td>
            </tr>
            <tr className="border-b dark:border-gray-700">
              <td className="px-4 py-3 font-medium">Net Payment</td>
              <td className="px-4 py-3">${payrollData.netPayment.toFixed(2)}</td>
            </tr>
            <tr className="border-b dark:border-gray-700">
              <td className="px-4 py-3 font-medium">Status</td>
              <td className="px-4 py-3">{payrollData.status}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Created At</td>
              <td className="px-4 py-3">{new Date(payrollData.createdAt).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollSummary;