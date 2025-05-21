import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const EmployeeForm = ({ employeeFormData, handleEmployeeInputChange, handleEmployeeSubmit, isLoading }) => {
  return (
    <div className="glass-card p-6 md:p-8 shadow-lg">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
        Add New Employee
      </h2>
      <form onSubmit={handleEmployeeSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 bg">
              Full Name
            </label>
            <Input
              name="name"
              value={employeeFormData.name}
              onChange={handleEmployeeInputChange}
              required
              placeholder="Enter full name"
              className="glass-input dark:bg-[#353E88] dark:border-none rounded-xl dark:text-slate-400"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <Input
              name="email"
              type="email"
              value={employeeFormData.email}
              onChange={handleEmployeeInputChange}
              required
              placeholder="Enter email"
              className="glass-input dark:bg-[#353E88] dark:border-none rounded-xl dark:text-slate-400"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={employeeFormData.gender}
              onChange={handleEmployeeInputChange}
              required
              className="w-full p-2 rounded-md glass-input dark:bg-[#353E88] dark:border-none rounded-xl dark:text-slate-400"
              disabled={isLoading}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>

            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Employment Type
            </label>
            <select
              name="employmentType"
              value={employeeFormData.employmentType}
              onChange={handleEmployeeInputChange}
              required
              className="w-full p-2 rounded-md glass-input dark:bg-[#353E88] dark:border-none rounded-xl dark:text-slate-400"
              disabled={isLoading}
            >
              <option value="">Select Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Position
            </label>
            <select
              name="position"
              value={employeeFormData.position}
              onChange={handleEmployeeInputChange}
              required
              className="w-full p-2 rounded-md glass-input dark:bg-[#353E88] dark:border-none rounded-xl dark:text-slate-400"
              disabled={isLoading}
            >
              <option value="">Select Position</option>
              <option value="CEO">CEO</option>
              <option value="COO">COO</option>
              <option value="CTO">CTO</option>
              <option value="CISO">CISO</option>
              <option value="Director">Director</option>
              <option value="Dept Lead">Dept Lead</option>
              <option value="Normal Employee">Normal Employee</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ">
              Employment Date
            </label>
            <Input
              name="employmentDate"
              type="date"
              value={employeeFormData.employmentDate}
              onChange={handleEmployeeInputChange}
              required
              className="w-full p-2 rounded-md glass-input dark:bg-[#353E88] dark:border-none rounded-xl dark:text-slate-400"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Basic Salary
            </label>
            <Input
              name="basicSalary"
              type="number"
              value={employeeFormData.basicSalary}
              onChange={handleEmployeeInputChange}
              required
              placeholder="Enter salary"
              className="w-full p-2 rounded-md glass-input dark:bg-[#353E88] dark:border-none rounded-xl dark:text-slate-400"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Bank Account Number
            </label>
            <Input
              name="bankAccountNumber"
              value={employeeFormData.bankAccountNumber}
              onChange={handleEmployeeInputChange}
              required
              placeholder="Enter account number"
              className="w-full p-2 rounded-md glass-input dark:bg-[#353E88] dark:border-none rounded-xl dark:text-slate-400"
              disabled={isLoading}
            />
          </div>
        </div>
        <Button
          type="submit"
          className="bg-gradient-to-r from-[#2BD383] to-[#119A8E] hover:from-[#119A8E] hover:to-[#2BD383] text-white rounded-xl"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Employee"}
        </Button>
      </form>
    </div>
  );
};

export default EmployeeForm;