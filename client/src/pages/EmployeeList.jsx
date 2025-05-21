const EmployeeList = ({ employees, isLoading }) => {
  return (
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
        <p className="text-sm text-muted-foreground">No employees found.</p>
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
                <tr key={employee._id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-3">{employee.name}</td>
                  <td className="px-4 py-3">{employee.email}</td>
                  <td className="px-4 py-3">{employee.gender}</td>
                  <td className="px-4 py-3">{employee.position}</td>
                  <td className="px-4 py-3">{employee.employmentType}</td>
                  <td className="px-4 py-3">{new Date(employee.employmentDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">${employee.basicSalary}</td>
                  <td className="px-4 py-3">{employee.bankAccountNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;