import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import Sidebar from "./Sidebar2";
import ThemeToggle from "../components/ui/ThemeToggle";

const PayrollList = ({ payrolls, isLoading, handleApprovePayroll }) => {
  if (isLoading) return <p>Loading payrolls...</p>;
  if (!payrolls.length) return <p>No payrolls found.</p>;

  return (
    <table className="min-w-full bg-white dark:bg-transparent rounded shadow overflow-hidden">
      <thead className="bg-gray-100 dark:bg-gray-700 text-left dark:text-white">
        <tr>
          <th className="p-3 dark:bg-[#353E88] rounded-l-xl">Employee</th>
          <th className="p-3 dark:bg-[#353E88]">Month</th>
          <th className="p-3 dark:bg-[#353E88]">Gross Pay</th>
          <th className="p-3 dark:bg-[#353E88]">Net Payment</th>
          <th className="p-3 dark:bg-[#353E88]">Status</th>
          <th className="p-3 dark:bg-[#353E88] rounded-r-xl">Action</th>
        </tr>
      </thead>
      <tbody>
        {payrolls.map((payroll) => (
          <tr key={payroll._id} className="border-b border-gray-200 dark:border-gray-700 dark:text-white ">
            <td className="p-3">{payroll.employee.name}</td>
            <td className="p-3">{payroll.month}</td>
            <td className="p-3">{payroll.grossPay.toFixed(2)}</td>
            <td className="p-3">{payroll.netPayment.toFixed(2)}</td>
            <td className="p-3 capitalize">{payroll.status}</td>
            <td className="p-3">
              {payroll.status !== "approved" ? (
                <button
                  onClick={() => handleApprovePayroll(payroll._id)}
                  className="bg-gradient-to-r from-[#2BD383] to-[#119A8E] hover:from-[#119A8E] hover:to-[#2BD383] hover:bg-green-700 text-white py-1 px-3 rounded"
                >
                  Approve
                </button>
              ) : (
                <span className="text-green-600 font-semibold">Approved</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ApprovedByDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [payrolls, setPayrolls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      toast.error("Please log in to access the dashboard");
      navigate("/login", { replace: true });
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    
    // if (parsedUser.role !== "approvedBy") {
    //   toast.error("Unauthorized access");
    //   navigate("/login", { replace: true });
    //   return;
    // }

    setUser(parsedUser);
    fetchPayrolls(token);
  }, [navigate]);

  const fetchPayrolls = async (token) => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/payroll/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPayrolls(response.data);
    } catch (error) {
      toast.error("Failed to fetch payrolls");
      console.error("Fetch payrolls error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovePayroll = async (payrollId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/payroll/approve/${payrollId}`,
        { status: "approved" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Payroll approved successfully");
      fetchPayrolls(token);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to approve payroll";
      toast.error(errorMessage);
      console.error("Approve payroll error:", error);
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
    <div className="min-h-screen flex bg-gray-50 bg-gradient-to-l dark:from-[#22285E] dark:to-[#191D50]">
      <Sidebar handleLogout={handleLogout} user={user} />
      <div className="flex-1 ml-64">
        <header className="bg-gradient-to-l from-[#ffffff] to-[#f8f9fa] dark:bg-gradient-to-l dark:from-[#191D50] dark:to-[#8C91C4] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Payroll Approval Dashboard
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
            <PayrollList
              payrolls={payrolls}
              isLoading={isLoading}
              handleApprovePayroll={handleApprovePayroll}
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ApprovedByDashboard;
