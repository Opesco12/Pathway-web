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
import Transactions from "./pages/Transactions";
import TransactionDetails from "./pages/TransasctionDetails";
import Profile from "./pages/Profile";
import Register from "./pages/auth/Register";
import Activation from "./pages/auth/Activation";
import PersonalDetails from "./pages/ProfileSettings/PersonalDetails";
import BankDetails from "./pages/ProfileSettings/BankDetails";
import ContactManager from "./pages/ProfileSettings/ContactManager";
import ChangePassword from "./pages/auth/ChangePassword";
import ResetPassword from "./pages/auth/RestPassword";
import Support from "./pages/Support";

function App() {
  const Layout = () => {
    return (
      <DataProvider>
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
      </DataProvider>
    );
  };

  return (
    <>
      <Router>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="invest" element={<Invest />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="invest/:portfolioId" element={<ProductDetails />} />
              <Route
                path="/portfolio/:portfolioId"
                element={<PortfolioDetails />}
              />

              <Route
                path="/portfolio/:portfolioId/redeem"
                element={<FixedIncomeWithdrawal />}
              />
              <Route path="/transactions" element={<Transactions />} />
              <Route
                path="/transaction/details"
                element={<TransactionDetails />}
              />
              <Route path="profile" element={<Profile />} />
              <Route
                path="/profile/personal-details"
                element={<PersonalDetails />}
              />
              <Route path="/profile/bank-details" element={<BankDetails />} />
              <Route
                path="/profile/contact-manager"
                element={<ContactManager />}
              />
              <Route path="/profile/support" element={<Support />} />
              <Route path="/change-password" element={<ChangePassword />} />
            </Route>
            <Route path="*" element={<p>Page not found</p>} />

            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/activate" element={<Activation />} />
            <Route path="/login/2fa" element={<OTPVerification />} />
          </Routes>
        </UserProvider>
      </Router>
    </>
  );
}

export default App;
