import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import Sidebar from "./Sidebar";
import EmployeeForm from "./EmployeeForm";
import PayrollForm from "./PayrollForm";
import PayrollSummary from "./PayrollSummary";
import EmployeeList from "./EmployeeList";
import ThemeToggle from "../components/ui/ThemeToggle";

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
    <div className="min-h-screen flex bg-gradient-to-r from-[#f9fafb] to-[#f3f4f6] dark:bg-gradient-to-r dark:from-[#22285E] dark:to-[#191D50]">
      <Sidebar
        setShowEmployeeForm={setShowEmployeeForm}
        setShowPayrollForm={setShowPayrollForm}
        handleLogout={handleLogout}
        user={user}
      />
      <div className="flex-1 ml-64">
        <header className="bg-gradient-to-l from-[#ffffff] to-[#f8f9fa] dark:bg-gradient-to-l dark:from-[#191D50] dark:to-[#8C91C4] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Employee List Dashboard
            </h1>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {showEmployeeForm && (
              <EmployeeForm
                employeeFormData={employeeFormData}
                handleEmployeeInputChange={handleEmployeeInputChange}
                handleEmployeeSubmit={handleEmployeeSubmit}
                isLoading={isLoading}
              />
            )}
            {showPayrollForm && (
              <PayrollForm
                payrollFormData={payrollFormData}
                handlePayrollInputChange={handlePayrollInputChange}
                handlePayrollSubmit={handlePayrollSubmit}
                employees={employees}
                isLoading={isLoading}
                payrollError={payrollError}
              />
            )}
            {payrollData && <PayrollSummary payrollData={payrollData} />}
            <EmployeeList employees={employees} isLoading={isLoading} />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default EmployeesDashboard;