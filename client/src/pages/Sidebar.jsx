import { LogOut, Plus, Users, DollarSign, Home, UserCog, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import bothLogo from '../assets/Qlogo.png';

const Sidebar = ({ setShowEmployeeForm, setShowPayrollForm, handleLogout, user }) => {
  return (
    <aside className="w-50 bg-gradient-to-l from-white to-slate-50 dark:from-[#22285E] dark:to-[#191D50] shadow-xl h-screen fixed top-0 left-0 flex flex-col border-r border-none dark:border-none transition-all duration-300 hover:shadow-2xl">      <div className="p-6 pb-4 border-b border-slate-100 dark:border-none">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-1 rounded-xl">
          <img
            src={bothLogo}
            alt="QelemMeda Logo"
            className="w-11 h-11 object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Qelem Meda
        </h2>
      </div>

      <div className="flex items-center gap-3 bg-slate-100 dark:bg-[#353E88] p-3 rounded-xl">
        <div className="bg-fidel-100 dark:bg-fidel-800 text-fidel-600 dark:text-fidel-300 p-2 rounded-full">
          <UserCog size={18} />
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-white">{user?.username}</p>
        </div>
      </div>
    </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 mb-2">
          Management
        </h3>

        <ul className="space-y-1">
          <li>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 transition-colors rounded-xl"
              onClick={() => setShowEmployeeForm((prev) => !prev)}
            >
              <div className="flex items-center gap-3 ">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-xl">
                  <Plus size={18} className="text-blue-500 dark:text-blue-400" />
                </div>
                <span className="font-medium">Add Employee</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </Button>
          </li>

          <li>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 transition-colors rounded-xl"
              onClick={() => setShowPayrollForm((prev) => !prev)}
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-xl">
                  <DollarSign size={18} className="text-green-500 dark:text-green-400" />
                </div>
                <span className="font-medium">Process Payroll</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </Button>
          </li>


        </ul>

        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 mt-6 mb-2 rounded-xl">
          Reports
        </h3>

        <ul className="space-y-1">
          <li>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 transition-colors rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="bg-amber-50 dark:bg-amber-900/30 p-2 rounded-xl">
                  <DollarSign size={18} className="text-amber-500 dark:text-amber-400" />
                </div>
                <span className="font-medium">Payroll History</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </Button>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-none">
        <Button
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-[#EF5444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C] text-white shadow-md hover:shadow-lg transition-all rounded-xl" onClick={handleLogout}
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </Button>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3">
          © Awtar Tech Squad
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;