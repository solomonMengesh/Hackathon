import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Sinup";
import { Toaster } from "./components/ui/sonner";
import Index from "./pages/Index";


const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
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

       
      </Routes>

      <Toaster />
    </>
  );
};

export default App;