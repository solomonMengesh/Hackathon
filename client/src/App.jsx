import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
 import Login from "./pages/Login";
import Signup from "./pages/Sinup";
import { Toaster } from "./components/ui/sonner";
import Index from "./pages/Index";
import EmployeesDashboard from "./pages/EmployeesDashboard";
import ApprovedByDashboard from "./pages/ApprovedByDashboard";

const MainLayout = ({ children }) => (
  <>
     {children}
     
  </>
);



const App = () => {
  const navigate = useNavigate();

 

  return (
    <>
     <Routes>
       <Route
          path="/"
          element={
            <MainLayout>
              <Index />
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <MainLayout>
              <Login />
            </MainLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <MainLayout>
              <Signup />
            </MainLayout>
          }
        />
<Route path="/employee-management" element={<EmployeesDashboard />} />
        <Route path="/payroll-approval" element={<ApprovedByDashboard />} />
        <Route
          path="*"
          element={
            <MainLayout>
              <h1>404 - Page Not Found</h1>
            </MainLayout>
          }
        />
       
      </Routes>

      <Toaster />
    </>
  );
};

export default App;










