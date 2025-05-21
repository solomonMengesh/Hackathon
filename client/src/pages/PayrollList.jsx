
import { Button } from "../components/ui/button";

const PayrollList = ({ payrolls, isLoading, handleApprovePayroll }) => {
  return (
    <div className="glass-card p-6 md:p-8 shadow-lg">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
        Payrolls Awaiting Approval
      </h2>
      {isLoading ? (
        <div className="flex justify-center">
          <svg
            className="animate-spin h-8 w-8 text-fidel-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : payrolls.length === 0 ? (
        <p className="text-sm text-muted-foreground">No payrolls awaiting approval.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-700 dark:text-slate-300">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3">Employee ID</th>
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3">Working Days</th>
                <th className="px-4 py-3">Gross Pay</th>
                <th className="px-4 py-3">Net Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map((payroll) => (
                <tr key={payroll._id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-3">{payroll.employee}</td>
                  <td className="px-4 py-3">{payroll.month}</td>
                  <td className="px-4 py-3">{payroll.workingDays}</td>
                  <td className="px-4 py-3">${payroll.grossPay.toFixed(2)}</td>
                  <td className="px-4 py-3">${payroll.netPayment.toFixed(2)}</td>
                  <td className="px-4 py-3">{payroll.status}</td>
                  <td className="px-4 py-3">{new Date(payroll.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Button
                      onClick={() => handleApprovePayroll(payroll._id)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                      disabled={isLoading}
                    >
                      Approve
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PayrollList;
