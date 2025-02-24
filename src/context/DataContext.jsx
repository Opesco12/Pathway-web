import { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "./UserContext";

import {
  getProducts,
  getWalletBalance,
  getMutualFundOnlineBalances,
  getFixedIcomeOnlineBalances,
} from "../api/apiClient";
import ChatWidget from "../component/ChatWidget";

import ResponsiveSidebar from "../component/ui/AppSidebar";
import Loader from "../component/ui/LoadingAnimation";

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const [userBalance, setUserBalance] = useState({
    currencyCode: "",
    balance: 0,
  });
  const [walletDetails, setWalletDetails] = useState({});
  const [products, setProducts] = useState([]);
  const [mutualFundBalances, setMutualFundBalances] = useState([]);
  const [fixedIncomePortfolio, setFixedIncomePortfolio] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  const updateFixedIncomePortfolio = async (products) => {
    const fixedIncomeProducts = products?.filter(
      (product) => product?.portfolioType === 9,
    );

    const balancePromises = fixedIncomeProducts?.map((product) =>
      getFixedIcomeOnlineBalances(product.portfolioId).then((balances) => ({
        portfolio: product.portfolioName,
        investments: balances?.length > 0 ? balances : [],
        portfolioType: product.portfolioType,
        portfolioId: product.portfolioId,
      })),
    );

    const updatedPortfolio = await Promise.all(balancePromises);

    setFixedIncomePortfolio((prev) => {
      const newItems = updatedPortfolio.filter(
        (item) =>
          item.investments.length > 0 &&
          !prev.some((prevItem) => prevItem.portfolio === item.portfolio),
      );
      return [...prev, ...newItems];
    });
  };

  const calculateTotalBalance = () => {
    var totalBalance = userBalance.balance;
    fixedIncomePortfolio.forEach((portfolio) => {
      var balance = 0;
      portfolio?.investments?.forEach(
        (investment) => (balance += investment?.currentValue),
      );

      totalBalance += balance;
    });

    mutualFundBalances?.forEach(
      (investment) => (totalBalance += investment?.balance),
    );

    setTotalBalance(totalBalance);
  };

  const refreshUserBalance = async () => {
    setIsDataLoading(true);
    const response = await getWalletBalance();

    setUserBalance({
      currencyCode: response[0]?.currencyCode,
      balance: response[0]?.amount,
    });
    setIsDataLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated) {
          const [walletResponse, productsResponse, mutualFundResponse] =
            await Promise.all([
              getWalletBalance(),
              getProducts(),
              getMutualFundOnlineBalances(),
            ]);

          setUserBalance({
            currencyCode: walletResponse[0]?.currencyCode,
            balance: walletResponse[0]?.amount,
          });

          setWalletDetails({
            accountNo: walletResponse[0]?.walletAccountNo,
            accountName: walletResponse[0]?.walletAccountName,
          });

          console.log(walletResponse);

          setProducts(productsResponse);
          updateFixedIncomePortfolio(productsResponse);

          setMutualFundBalances(mutualFundResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setTimeout(() => {
          setIsDataLoading(false);
        }, 1000);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    calculateTotalBalance();
  }, [fixedIncomePortfolio, mutualFundBalances, userBalance]);

  if (isDataLoading)
    return (
      <div className="flex h-screen overflow-hidden">
        <ResponsiveSidebar />
        <div className="flex flex-1 items-center justify-center overflow-y-auto bg-[#f5f5f5]">
          <Loader />
        </div>
      </div>
    );

  return (
    <DataContext.Provider
      value={{
        userBalance,
        products,
        totalBalance,
        mutualFundBalances,
        fixedIncomePortfolio,
        refreshUserBalance,
        walletDetails,
      }}
    >
      {children}
      <ChatWidget />
    </DataContext.Provider>
  );
};

export default DataProvider;

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within an AuthProvider");
  }
  return context;
};
