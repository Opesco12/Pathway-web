import { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "./UserContext";

import {
  getProducts,
  getWalletBalance,
  getMutualFundOnlineBalances,
  getFixedIcomeOnlineBalances,
} from "../api/apiClient";
import ChatWidget from "../component/ChatWidget";

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const { loading, setLoading, user, isAuthenticated } = useAuth();
  const [userBalance, setUserBalance] = useState({
    currencyCode: "",
    balance: 0,
  });
  const [products, setProducts] = useState([]);
  const [mutualFundBalances, setMutualFundBalances] = useState([]);
  const [fixedIncomePortfolio, setFixedIncomePortfolio] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      //   setLoading(true);
      const response = await getWalletBalance();
      console.log(response);
      setUserBalance({
        currencyCode: response[0]?.currencyCode,
        balance: response[0]?.amount,
      });

      const products = await getProducts();
      console.log(products);
      setProducts(products);

      setLoading(false);
    };

    fetchData();
  }, [isAuthenticated]);

  return (
    <DataContext.Provider value={{ userBalance, products }}>
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
