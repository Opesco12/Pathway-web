import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Routes,
  Outlet,
  Navigate,
  Route,
} from "react-router-dom";

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
import ProductDetails from "./pages/ProductDetails";
import PortfolioDetails from "./pages/PortfolioDetails";
import FixedIncomeWithdrawal from "./pages/FixedIncomeWithdrawal";

function App() {
  const Layout = () => {
    return (
      <ProtectedRoute>
        <div className="flex h-[100vh] overflow-hidden">
          <ResponsiveSidebar />
          <main className="flex-1 overflow-y-auto bg-[#f5f5f5]">
            <div className="mx-auto min-h-full max-w-[1024px] px-4 py-15 md:px-8 lg:px-12">
              <Outlet />
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  };

  return (
    <>
      <Router>
        <UserProvider>
          <DataProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="invest" element={<Invest />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route
                  path="invest/:portfolioId"
                  element={<ProductDetails />}
                />
                <Route
                  path="/portfolio/:portfolioId"
                  element={<PortfolioDetails />}
                />

                <Route
                  path="/portfolio/:portfolioId/redeem"
                  element={<FixedIncomeWithdrawal />}
                />
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
