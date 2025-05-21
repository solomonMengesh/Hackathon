import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { LogOut, Plus } from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle";
import axios from "axios";

const EmployeesDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [employeeFormData, setEmployeeFormData] = useState({
    name: "",
    gender: "",
    employmentType: "",
    position: "",
    employmentDate: "",
    basicSalary: "",
    bankAccountNumber: "",
    email: "",
  });
  const [payrollFormData, setPayrollFormData] = useState({
    employeeId: "",
    month: "",
    workingDays: "",
    positionAllowance: "",
    transportAllowance: "",
    otherCommission: "",
  });
  const [payrollData, setPayrollData] = useState(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showPayrollForm, setShowPayrollForm] = useState(false);
  const [payrollError, setPayrollError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      toast.error("Please log in to access the dashboard");
      navigate("/login", { replace: true });
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "preparedBy") {
      toast.error("Unauthorized access");
      navigate("/", { replace: true });
      return;
    }

    setUser(parsedUser);
    fetchEmployees(token);
  }, [navigate]);

  const fetchEmployees = async (token) => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
    } catch (error) {
      toast.error("Failed to fetch employees");
      console.error("Fetch employees error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmployeeInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayrollInputChange = (e) => {
    const { name, value } = e.target;
    setPayrollFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/employees/cre",
        employeeFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Employee created successfully");
      setEmployeeFormData({
        name: "",
        gender: "",
        employmentType: "",
        position: "",
        employmentDate: "",
        basicSalary: "",
        bankAccountNumber: "",
        email: "",
      });
      setShowEmployeeForm(false);
      fetchEmployees(token);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create employee";
      toast.error(errorMessage);
      console.error("Create employee error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayrollSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPayrollError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/payroll",
        {
          employeeId: payrollFormData.employeeId,
          month: payrollFormData.month,
          workingDays: parseInt(payrollFormData.workingDays),
          positionAllowance: parseFloat(payrollFormData.positionAllowance),
          transportAllowance: parseFloat(payrollFormData.transportAllowance),
          otherCommission: parseFloat(payrollFormData.otherCommission),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPayrollData(response.data);
      toast.success("Payroll submitted successfully");
      setPayrollFormData({
        employeeId: "",
        month: "",
        workingDays: "",
        positionAllowance: "",
        transportAllowance: "",
        otherCommission: "",
      });
      setShowPayrollForm(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to submit payroll";
      setPayrollError(errorMessage);
      toast.error(errorMessage);
      console.error("Submit payroll error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Employee Management Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Welcome, {user.username}
            </span>
            <Button
              onClick={handleLogout}
              className="bg-fidel-500 hover:bg-fidel-600 text-white"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex justify-end space-x-4">
            <Button
              onClick={() => setShowEmployeeForm(!showEmployeeForm)}
              className="bg-fidel-500 hover:bg-fidel-600 text-white"
            >
              <Plus size={18} className="mr-2" />
              {showEmployeeForm ? "Close Employee Form" : "Add Employee"}
            </Button>
            <Button
              onClick={() => setShowPayrollForm(!showPayrollForm)}
              className="bg-fidel-500 hover:bg-fidel-600 text-white"
            >
              <Plus size={18} className="mr-2" />
              {showPayrollForm ? "Close Payroll Form" : "Add Payroll"}
            </Button>
          </div>

          {/* Employee Form */}
          {showEmployeeForm && (
            <div className="glass-card p-6 md:p-8 shadow-lg">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Add New Employee
              </h2>
              <form onSubmit={handleEmployeeSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Name
                    </label>
                    <Input
                      name="name"
                      value={employeeFormData.name}
                      onChange={handleEmployeeInputChange}
                      required
                      placeholder="Enter name"
                      className="glass-input"
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
                      className="glass-input"
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
                      className="glass-input w-full p-2 rounded-md"
                      disabled={isLoading}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
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
                      className="glass-input w-full p-2 rounded-md"
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
                      className="glass-input w-full p-2 rounded-md"
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
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Employment Date
                    </label>
                    <Input
                      name="employmentDate"
                      type="date"
                      value={employeeFormData.employmentDate}
                      onChange={handleEmployeeInputChange}
                      required
                      className="glass-input"
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
                      className="glass-input"
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
                      className="glass-input"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="bg-fidel-500 hover:bg-fidel-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Employee"}
                </Button>
              </form>
            </div>
          )}

          {/* Payroll Form */}
          {showPayrollForm && (
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
                      className="glass-input w-full p-2 rounded-md"
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
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Month
                    </label>
                    <Input
                      name="month"
                      value={payrollFormData.month}
                      onChange={handlePayrollInputChange}
                      required
                      placeholder="YYYY-MM"
                      className="glass-input"
                      disabled={isLoading}
                    />
                  </div>
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
                      className="glass-input"
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
                      className="glass-input"
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
                      className="glass-input"
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
                      className="glass-input"
                      step="0.01"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="bg-fidel-500 hover:bg-fidel-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Payroll"}
                </Button>
                {payrollError && (
                  <p className="text-red-500 text-sm mt-2">{payrollError}</p>
                )}
              </form>
            </div>
          )}

          {/* Payroll Summary */}
          {payrollData && (
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
                      <td className="px-4 py-3">
                        ${payrollData.earnedSalary.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="px-4 py-3 font-medium">Position Allowance</td>
                      <td className="px-4 py-3">
                        ${payrollData.positionAllowance.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="px-4 py-3 font-medium">Transport Allowance</td>
                      <td className="px-4 py-3">
                        ${payrollData.transportAllowance.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="px-4 py-3 font-medium">Other Commission</td>
                      <td className="px-4 py-3">
                        ${payrollData.otherCommission.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="px-4 py-3 font-medium">Gross Pay</td>
                      <td className="px-4 py-3">${payrollData.grossPay.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="px-4 py-3 font-medium">Taxable Income</td>
                      <td className="px-4 py-3">
                        ${payrollData.taxableIncome.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="px-4 py-3 font-medium">Tax Deduction</td>
                      <td className="px-4 py-3">
                        ${payrollData.deductions.tax.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="px-4 py-3 font-medium">Pension Deduction</td>
                      <td className="px-4 py-3">
                        ${payrollData.deductions.pension.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="px-4 py-3 font-medium">Total Deduction</td>
                      <td className="px-4 py-3">
                        ${payrollData.totalDeduction.toFixed(2)}
                      </td>
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
                      <td className="px-4 py-3">
                        {new Date(payrollData.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Employee List */}
          <div className="glass-card p-6 md:p-8 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Employee List
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
            ) : employees.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No employees found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-700 dark:text-slate-300">
                  <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Gender</th>
                      <th className="px-4 py-3">Position</th>
                      <th className="px-4 py-3">Employment Type</th>
                      <th className="px-4 py-3">Employment Date</th>
                      <th className="px-4 py-3">Salary</th>
                      <th className="px-4 py-3">Bank Account</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr
                        key={employee._id}
                        className="border-b dark:border-gray-700"
                      >
                        <td className="px-4 py-3">{employee.name}</td>
                        <td className="px-4 py-3">{employee.email}</td>
                        <td className="px-4 py-3">{employee.gender}</td>
                        <td className="px-4 py-3">{employee.position}</td>
                        <td className="px-4 py-3">{employee.employmentType}</td>
                        <td className="px-4 py-3">
                          {new Date(employee.employmentDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">${employee.basicSalary}</td>
                        <td className="px-4 py-3">{employee.bankAccountNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default EmployeesDashboard;