import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const PayrollForm = ({ payrollFormData, handlePayrollInputChange, handlePayrollSubmit, employees, isLoading, payrollError }) => {
  return (
    <div className="glass-card p-6 md:p-8 shadow-lg">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
        Add New Payroll
      </h2>
      <form onSubmit={handlePayrollSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Employee
            </label>
            <select
              name="employeeId"
              value={payrollFormData.employeeId}
              onChange={handlePayrollInputChange}
              required
              className="w-full p-2 rounded-md glass-input dark:bg-[#353E88] dark:border-none rounded-xl dark:text-slate-400"
              disabled={isLoading}
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name} ({employee.email})
                </option>
              ))}
            </select>
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Month
            </label>
            <Input
              name="month"
              value={payrollFormData.month}
              onChange={handlePayrollInputChange}
            
              placeholder="YYYY-MM"
              className="w-full p-2 rounded-md glass-input dark:bg-[#353E88] dark:border-none rounded-xl dark:text-slate-400"
              disabled={isLoading}
            />
          </div> */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Working Days
            </label>
            <Input
              name="workingDays"
              type="number"
              value={payrollFormData.workingDays}
              onChange={handlePayrollInputChange}
              required
              placeholder="Enter working days"
              className="w-full p-2 rounded-md glass-input dark:bg-[#353E88] dark:border-none rounded-xl dark:text-slate-400"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Position Allowance
            </label>
            <Input
              name="positionAllowance"
              type="number"
              value={payrollFormData.positionAllowance}
              onChange={handlePayrollInputChange}
              required
              placeholder="Enter position allowance"
              className="w-full p-2 rounded-md glass-input dark:bg-[#353E88] dark:border-none rounded-xl dark:text-slate-400"
              step="0.01"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Transport Allowance
            </label>
            <Input
              name="transportAllowance"
              type="number"
              value={payrollFormData.transportAllowance}
              onChange={handlePayrollInputChange}
              required
              placeholder="Enter transport allowance"
              className="w-full p-2 rounded-md glass-input dark:bg-[#353E88] dark:border-none rounded-xl dark:text-slate-400"
              step="0.01"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Other Commission
            </label>
            <Input
              name="otherCommission"
              type="number"
              value={payrollFormData.otherCommission}
              onChange={handlePayrollInputChange}
              required
              placeholder="Enter other commission"
              className="w-full p-2 rounded-md glass-input dark:bg-[#353E88] dark:border-none rounded-xl dark:text-slate-400"
              step="0.01"
              disabled={isLoading}
            />
          </div>
        </div>
        <Button
          type="submit"
          className="bg-gradient-to-r from-[#2BD383] to-[#119A8E] hover:from-[#119A8E] hover:to-[#2BD383] text-white rounded-xl"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit Payroll"}
        </Button>
        {payrollError && (
          <p className="text-red-500 text-sm mt-2">{payrollError}</p>
        )}
      </form>
    </div>
  );
};

export default PayrollForm;