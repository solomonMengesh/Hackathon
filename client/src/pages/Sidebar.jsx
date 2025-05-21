import { LogOut, Plus, Users, DollarSign, Home, UserCog, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";

const Sidebar = ({ setShowEmployeeForm, setShowPayrollForm, handleLogout, user }) => {
  return (
    <aside className="w-50 bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-800 shadow-xl h-screen fixed top-0 left-0 flex flex-col border-r border-slate-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
      <div className="p-6 pb-4 border-b border-slate-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-fidel-500 text-white p-3 rounded-xl shadow-md">
            <Home size={22} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            QelemMeda
          </h2>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-gray-700 p-3 rounded-lg">
          <div className="bg-fidel-100 dark:bg-fidel-800 text-fidel-600 dark:text-fidel-300 p-2 rounded-full">
            <UserCog size={18} />
          </div>
          <div>
            <p className="font-medium text-slate-800 dark:text-white">{user?.username}</p>
            {/* <p className="text-xs text-slate-500 dark:text-slate-400">Admin Account</p> */}
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
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 transition-colors"
              onClick={() => setShowEmployeeForm((prev) => !prev)}
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
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
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 transition-colors"
              onClick={() => setShowPayrollForm((prev) => !prev)}
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-lg">
                  <DollarSign size={18} className="text-green-500 dark:text-green-400" />
                </div>
                <span className="font-medium">Process Payroll</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </Button>
          </li>
          
          {/* <li>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded-lg">
                  <Users size={18} className="text-purple-500 dark:text-purple-400" />
                </div>
                <span className="font-medium">Team Management</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </Button>
          </li> */}
        </ul>
        
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 mt-6 mb-2">
          Reports
        </h3>
        
        <ul className="space-y-1">
          <li>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-amber-50 dark:bg-amber-900/30 p-2 rounded-lg">
                  <DollarSign size={18} className="text-amber-500 dark:text-amber-400" />
                </div>
                <span className="font-medium">Payroll History</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </Button>
          </li>
        </ul>
      </nav>

       <div className="p-4 border-t border-slate-100 dark:border-gray-700">
        <Button
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </Button>
        
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3">
          QelemMeda v2.4.1
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;