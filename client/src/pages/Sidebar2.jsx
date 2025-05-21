
import { LogOut, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";

const Sidebar = ({ handleLogout, user }) => {
  return (
    <aside className=" recyclable w-64 bg-white dark:bg-gray-800 shadow-md h-screen fixed top-0 left-0 flex flex-col">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Approval Dashboard
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
          Welcome, {user?.username}
        </p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Button
          className="w-full flex items-center space-x-2 bg-fidel-500 hover:bg-fidel-600 text-white"
          disabled
        >
          <CheckCircle size={18} />
          <span>Payroll Approval</span>
        </Button>
        <Button
          className="w-full flex items-center space-x-2 bg-fidel-500 hover:bg-fidel-600 text-white"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </nav>
    </aside>
  );
};

export default Sidebar;
 