import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Routes,
  Outlet,
  Navigate,
  Route,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import ResponsiveSidebar from "./component/ui/AppSidebar";
import "./App.css";
import StyledText from "./component/ui/StyledText";
import { Colors } from "./constants/Color";
import { amountFormatter } from "./utils/amountFormatter";

import Dashboard from "./pages/Dashboard";
import Invest from "./pages/Invest";
import Portfolio from "./pages/Portfolio";
import Login from "./pages/auth/Login";
import OTPVerification from "./pages/auth/OTP";
import { ProtectedRoute, UserProvider } from "./context/UserContext";
import DataProvider from "./context/DataContext";

function App() {
  const Layout = () => {
    return (
      <ProtectedRoute>
        <div className="flex h-screen overflow-hidden">
          <ResponsiveSidebar />
          <main className="flex-1 overflow-y-auto bg-[#f5f5f5]">
            <div className="mx-auto h-full max-w-[1024px] px-4 py-10 md:px-8 lg:px-12">
              <Outlet />
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  };

  return (
    <>
      <ToastContainer autoClose={3000} />
      <Router>
        <UserProvider>
          <DataProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="invest" element={<Invest />} />
                <Route path="portfolio" element={<Portfolio />} />
              </Route>
              <Route path="*" element={<p>Page not found</p>} />

              <Route path="/login" element={<Login />} />

              <Route path="/login/2fa" element={<OTPVerification />} />
            </Routes>
          </DataProvider>
        </UserProvider>
      </Router>
    </>
  );
}

export default App;
