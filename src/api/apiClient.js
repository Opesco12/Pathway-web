import { toast } from "react-toastify";
import axios from "axios";
import { Navigate } from "react-router-dom";

import { endpoints } from "./endpoints";
import { userStorage } from "../storage/userStorage";
import { keys } from "../storage/keys";

const BASE_URL = "https://pathway-proxy.vercel.app/api/v1";

const getAuthToken = async () => {
  const data = userStorage.getItem(keys.user);
  console.log("is there token??? ", data);
  return data?.token;
};

export const authEvents = new EventTarget();

const handleAuthError = () => {
  // Dispatch a custom event when auth error occurs
  const event = new Event("authError");
  authEvents.dispatchEvent(event);
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

const apiCall = async ({
  endpoint,
  method = "GET",
  data = null,
  requiresAuth = true,
  customConfig = {},
} = {}) => {
  try {
    if (!endpoint) {
      throw new Error("Endpoint is required");
    }

    const config = {
      method,
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
      },
      ...customConfig,
    };

    if (data) {
      config.data = data;
    }

    if (requiresAuth) {
      const token = await getAuthToken();
      if (!token) {
        // throw new Error("Authentication required but no token found");
        console.log("No auth token found");
        window.location.href = "/login";
        return;
      }
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    console.error("API call error:", error);
    if (error.response?.status === 401) {
      handleAuthError();
      return;
    }
    throw error;
  }
};

export const getCountries = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getCountries,
      method: "GET",
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    console.log(error);
    toast.error("Unable to fetch countries");
  }
};

export const registerNewIndividual = async (info) => {
  try {
    const data = await apiCall({
      method: "POST",
      endpoint: endpoints.RegisterNewIndividual,
      data: info,
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    console.log(error);
    if (error.status === 400) {
      toast.error("Invalid Details or account already exists");
    } else {
      toast.error("An error occured");
    }
  }
};

export const getClientInfo = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getClientInfo,
      method: "GET",
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getNextOfKins = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getNextOfKins,
      method: "GET",
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const createNextOfKin = async (info) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.createNextOfKin,
      method: "POST",
      data: info,
    });

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const login = async (username, password) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.Login,
      method: "POST",
      data: { username: username, password: password },
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    console.log(error);
    if (error.status === 400) {
      toast.error("Invalid username or password");
    } else {
      toast.error("Please try again later");
    }
  }
};

export const login2fa = async (info) => {
  console.log(info);
  try {
    const data = await apiCall({
      endpoint: endpoints.Login2Fa,
      method: "POST",
      requiresAuth: false,
      data: {
        username: info.email,
        securityCode: info.code,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    if (error.status === 400) {
      toast.error("Incorrect Security Code");
    } else {
      toast.error("Please try again later");
    }
  }
};

export const activateAccount = async (info) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ActivateAccount,
      method: "POST",
      data: info,
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    console.log(error);
    if (error.status === 400) {
      toast.error(
        "Invalid security passcode or security login passcode has expired",
      );
    } else {
      toast.error("Please try again later");
    }
  }
};

export const resnedActivationCode = async (info) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ResendActivationCode,
      method: "POST",
      data: info,
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    console.log(error);
    if (error.status === 400) {
      toast.error("Invalid details or account already exists");
    } else {
      toast.error("Please try again later");
    }
  }
};

export const logout = async (token) => {
  try {
    const data = await apiCall({
      method: "POST",
      endpoint: endpoints.Logout,
      data: { token: token },
    });
    return data;
  } catch (error) {}
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ChangePassword,
      method: "POST",
      data: { oldPassword: oldPassword, newPassword: newPassword },
    });
    return data;
  } catch (error) {
    console.log(error);
    if (error.status === 400) {
      toast.error("Incorrect Password");
    } else {
      toast.error("An error occured");
    }
  }
};

export const resetPasswordRequest = async (email) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ResetPasswordRequest,
      method: "POST",
      data: { username: email, emailAddress: email },
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    console.log(error);
    if (error.status === 400) {
      toast.error("Please input a registered email address");
    } else {
      toast.error("An error occured");
    }
  }
};

export const resetPassword = async (token, password) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ResetPassword,
      method: "POST",
      data: { token: token, password: password },
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    console.log(error);
    if (error.status === 400) {
      toast.error("An error occured, Please confirm that the token is correct");
    } else {
      toast.error("An error occured");
    }
  }
};

export const getWalletBalance = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getWalletBalance,
      method: "GET",
      requiresAuth: true,
    });
    return data;
  } catch (error) {
    console.log(error);
    // toast.error("Unable to fetch wallet balances");
  }
};

export const getProducts = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getProducts,
      method: "GET",
      requiresAuth: true,
    });
    return data;
  } catch (error) {
    console.log(error);
    toast.error("Unable to fetch data");
  }
};

export const getVirtualAccounts = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getVirtualAccounts,
      method: "GET",
    });
    return data;
  } catch (error) {}
};

export const getClientPortfolio = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getPortfolio,
      method: "GET",
    });
    return data;
  } catch (error) {
    toast.error("An error occured");
  }
};

export const getMutualFundOnlineBalances = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getMutualFundOnlineBalances,
      method: "GET",
    });
    return data;
  } catch (error) {}
};

export const getMutualFundOnlineBalance = async (portfolioId) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getMutualFundOnlineBalance}/${portfolioId}`,
      method: "GET",
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getMutualFundStatement = async (portfolioId) => {
  try {
    const date = new Date().toISOString();
    const data = await apiCall({
      endpoint: `${endpoints.getMutualFundStatement}/${portfolioId}/${date}`,
      method: "GET",
    });
    return data;
  } catch (err) {
    console.log(err);
    toast.error("Unable to fetch statements");
  }
};

export const getTransactions = async (startdate, enddate) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getTransactions}/${startdate}/${enddate}`,
      method: "GET",
    });
    return data;
  } catch (error) {}
};

export const getRecentTransactions = async () => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getRecentTransactions}/5`,
      method: "GET",
    });
    return data;
  } catch (error) {
    toast.error("An error occured");
  }
};

export const mutualFundSubscription = async ({
  accountNumber,
  portfolioId,
  amount,
}) => {
  if (accountNumber) {
  } else {
    try {
      const data = await apiCall({
        endpoint: endpoints.mutualFundNoAccount,
        method: "POST",
        data: {
          portfolioId: portfolioId,
          amount: amount,
        },
      });
      console.log("The request gave back: ", data);
      return data;
    } catch (error) {
      console.log(error);
      toast.error("An error occured");
    }
  }
};

export const mutualfundRedemption = async (accountNo, amount) => {
  try {
    console.log("account numer is:", accountNo);
    console.log("amount is : ", amount);
    const data = await apiCall({
      endpoint: endpoints.mutualfundRedemption,
      method: "POST",
      data: {
        mutualfundAccountNo: accountNo,
        amount: amount,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
    toast.error("An error occured while processing fund withdrawal");
  }
};

export const getFixedIcomeOnlineBalances = async (portfolioId) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getFixedIncomeBalances}/${portfolioId}`,
      method: "GET",
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getLiabilityProducts = async (portfolioId) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getLiabilityProducts}/${portfolioId}`,
      method: "GET",
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getTenor = async (productId) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getProductTenor}/${productId}`,
      method: "GET",
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fixedIncomeSubscriptionOrder = async ({
  securityProductId,
  portfolioId,
  currency,
  faceValue,
  tenor,
}) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.fixedIncomeSubscription,
      method: "POST",
      data: {
        securityProductId: securityProductId,
        portfolioId: portfolioId,
        currency: currency,
        faceValue: faceValue,
        tenor: tenor,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
    toast.error("An error occured");
  }
};

export const fixedIncomeRedemptionOrder = async (referenceNo, amount) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.fixedIncomeRedemption,
      method: "POST",
      data: {
        purchaseReferenceNo: referenceNo,
        faceValue: amount,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    toast.error("An error occured while processing fund withdrawal");
  }
};
