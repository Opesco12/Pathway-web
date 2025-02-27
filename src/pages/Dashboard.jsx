import {
  ReceiveSquare2,
  TransmitSqaure2,
  EmptyWallet,
  EyeSlash,
  Flash,
  ProfileCircle,
  ReceiptText,
  Eye,
  StatusUp,
  FavoriteChart,
  Reserve,
  Money,
  Bank,
  Copy,
  CopySuccess,
} from "iconsax-react";
import { useState, useEffect } from "react";

import StyledText from "../component/ui/StyledText";
import { Colors } from "../constants/Color";

import { amountFormatter } from "../utils/amountFormatter";
import { useAuth } from "../context/UserContext";
import { getFormattedDate } from "../utils/functions/date";
import { getRecentTransactions, getWalletBalance } from "../api/apiClient";
import AppModal from "../component/ui/AppModal";
import { useData } from "../context/DataContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [hideBalance, setHideBalance] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [copied, setCopied] = useState(false);

  const { user } = useAuth();
  const { userBalance, walletDetails } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getRecentTransactions();
      console.log(response);
      setRecentTransactions(response);
    };

    fetchData();
  }, []);

  function convertToDateString(date) {
    return new Date(date).toDateString();
  }

  const toggleChat = () => {
    if (!window.Tawk_API) return;
    if (window.Tawk_API.isChatHidden()) {
      window.Tawk_API.showWidget();
      window.Tawk_API.maximize();
    } else {
      window.Tawk_API.maximize();
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 10000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between rounded-xl bg-white p-5">
        <div className="flex items-center gap-2">
          <ProfileCircle size={30} color={Colors.light} />
          <StyledText type="title" variant="medium">
            Hello, {user?.fullName?.split(" ")[0]}
          </StyledText>
        </div>
        <StyledText type="label" color={Colors.light}>
          {getFormattedDate()}
        </StyledText>
      </div>

      <div
        className="mt-5 flex flex-col items-center justify-center gap-5 rounded-xl border py-5"
        style={{
          backgroundColor: Colors.box,
          borderColor: Colors.boxBorder,
        }}
      >
        <div className="flex items-center justify-center gap-1">
          <EmptyWallet size={18} color={Colors.primary} variant="Bold" />
          <StyledText type="label" color={Colors.primary}>
            Wallet Balance
          </StyledText>
        </div>

        <div className="flex items-center justify-center gap-1">
          <StyledText
            type="heading"
            variant="bold"
            color={Colors.primary}
            style={{ fontSize: "2rem" }}
            className={`${hideBalance ? "blur-lg" : ""}`}
          >
            {amountFormatter.format(userBalance?.balance)}
          </StyledText>
          {hideBalance ? (
            <Eye
              size={20}
              color={Colors.light}
              variant="Bold"
              onClick={() => setHideBalance(!hideBalance)}
            />
          ) : (
            <EyeSlash
              size={20}
              color={Colors.light}
              variant="Bold"
              onClick={() => setHideBalance(!hideBalance)}
            />
          )}
        </div>

        <div className="flex items-center justify-center gap-5">
          <div
            className="border-primary flex w-[160px] items-center justify-center gap-1 rounded-full border bg-white p-6 py-2 hover:border-none hover:bg-[#73CAEE]"
            style={{
              borderColor: "#4D4D4D",
              borderWidth: "0.5px",
            }}
            onClick={() => setIsDepositModalOpen(true)}
          >
            <ReceiveSquare2 variant="Bold" color={Colors.primary} size={25} />
            <StyledText type="label">Deposit</StyledText>
          </div>

          <div
            className="flex w-[160px] items-center justify-center gap-1 rounded-full border bg-white p-6 py-2 hover:border-none hover:bg-[#000050] hover:text-white"
            style={{ borderColor: "#4D4D4D", borderWidth: "0.5px" }}
            onClick={() => setIsWithdrawalModalOpen(true)}
          >
            <TransmitSqaure2
              variant="Bold"
              color={Colors.lightPrimary}
              size={25}
            />
            <StyledText type="label">Withdraw</StyledText>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 items-start gap-5 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6">
          <div className="flex items-center gap-2 border-b border-[#B0B0B0] pb-3">
            <Flash size={25} color={Colors.lightPrimary} variant="Bold" />
            <StyledText color={Colors.primary}>Quick Access</StyledText>
          </div>

          <ContentBox onClick={() => navigate("/invest")}>
            <div className="flex items-center justify-between">
              <div>
                <StyledText color={Colors.primary} variant="semibold">
                  Invest Money
                </StyledText>
                <br />
                <StyledText color={Colors.primary} type="label">
                  Grow your wealth securely
                </StyledText>
              </div>

              <StatusUp size={55} color={Colors.lightPrimary} variant="Bold" />
            </div>
          </ContentBox>

          <ContentBox onClick={() => navigate("/portfolio")}>
            <div className="flex items-center justify-between">
              <div>
                <StyledText color={Colors.primary} variant="semibold">
                  My Portfolio
                </StyledText>
                <br />
                <StyledText color={Colors.primary} type="label">
                  Track your investments at a glance
                </StyledText>
              </div>

              <FavoriteChart
                size={55}
                color={Colors.lightPrimary}
                variant="Bold"
              />
            </div>
          </ContentBox>

          <div className="grid grid-cols-2 gap-2">
            <ContentBox onClick={() => navigate("/transactions")}>
              <ReceiptText
                size={25}
                color={Colors.lightPrimary}
                variant="Bold"
                className="my-1"
              />

              <StyledText color={Colors.primary} variant="semibold">
                Transactions
              </StyledText>
              <br />
              <StyledText color={Colors.primary} type="label">
                Monitor your financial activity
              </StyledText>
            </ContentBox>
            <ContentBox onClick={toggleChat}>
              <Reserve
                size={25}
                color={Colors.lightPrimary}
                variant="Bold"
                className="my-1"
              />

              <StyledText color={Colors.primary} variant="semibold">
                Help Desk
              </StyledText>
              <br />
              <StyledText color={Colors.primary} type="label">
                Reliable support when you need it
              </StyledText>
            </ContentBox>
          </div>
        </div>

        <div className="min-h-[200px] rounded-xl bg-white p-6">
          <div className="flex items-center gap-2 border-b border-[#B0B0B0] pb-3">
            <ReceiptText size={25} color={Colors.lightPrimary} variant="Bold" />
            <StyledText color={Colors.primary}>Recent Transactions</StyledText>
          </div>

          {recentTransactions?.length > 0 ? (
            recentTransactions?.map((transaction, index) => (
              <div
                onClick={() =>
                  navigate("/transaction/details", { state: transaction })
                }
                key={index}
                className="flex w-full items-center gap-3 border-b border-[#B0B0B0] py-2"
              >
                <Money size={25} variant="Bold" color={Colors.lightPrimary} />
                <div className="flex flex-1 items-center justify-between">
                  <div className="w-[60%]">
                    <StyledText
                      variant="semibold"
                      color={Colors.primary}
                      className={"w-[100%] truncate"}
                    >
                      {transaction?.portfolio}
                    </StyledText>{" "}
                    <br />
                    <StyledText
                      type="label"
                      color={Colors.light}
                      // className={"truncate"}
                    >
                      {transaction?.description} -{" "}
                      {convertToDateString(transaction.valueDate)}
                    </StyledText>
                  </div>
                  <StyledText
                    variant="semibold"
                    color={Colors.primary}
                    // className={"w-[25%] truncate text-center"}
                  >
                    {amountFormatter.format(transaction?.amount)}
                  </StyledText>
                </div>
              </div>
            ))
          ) : (
            <div className="mt-5">
              <StyledText
                color={Colors.light}
                style={{ textAlign: "center", width: "100%" }}
              >
                Your recent transactions will appear here
              </StyledText>
            </div>
          )}
        </div>
      </div>

      <AppModal
        title={"Deposit"}
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
      >
        <div className="">
          <Bank
            size={50}
            color={Colors.primary}
            className="mx-auto mt-[20px] mb-[25px]"
          />

          <p className="font-md my-4 text-center text-gray-600">
            Send money to the bank account details below to fund your wallet.
          </p>

          <div className="hover:bg-border flex items-center justify-between rounded-lg p-2">
            <div>
              <h3 className="font-semibold">{walletDetails?.accountName}</h3>
              {/* <p>{account?.virtualAccountNo}</p> */}
              <h4 className="font-medium">{walletDetails?.accountNo}</h4>
            </div>
            {copied ? (
              <CopySuccess size={25} color={Colors.primary} />
            ) : (
              <Copy
                size={25}
                color={Colors.primary}
                onClick={() => handleCopy(walletDetails?.accountNo)}
              />
            )}
          </div>
        </div>
      </AppModal>

      <AppModal
        title={"Withdrawal"}
        isOpen={isWithdrawalModalOpen}
        onClose={() => setIsWithdrawalModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;

const ContentBox = ({ children, onClick }) => {
  return (
    <div onClick={onClick} className="my-3 rounded-xl bg-[#ECF9FF] p-4">
      {children}
    </div>
  );
};
