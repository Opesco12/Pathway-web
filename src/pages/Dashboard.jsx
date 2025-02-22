import {
  ReceiveSquare2,
  TransmitSqaure2,
  EmptyWallet,
  EyeSlash,
  Flash,
  Receipt,
  ReceiptText,
  Eye,
  StatusUp,
  FavoriteChart,
  Reserve,
} from "iconsax-react";
import { useState, useEffect } from "react";

import StyledText from "../component/ui/StyledText";
import { Colors } from "../constants/Color";

import { amountFormatter } from "../utils/amountFormatter";
import { useAuth } from "../context/UserContext";
import { getFormattedDate } from "../utils/functions/date";
import { getWalletBalance } from "../api/apiClient";

const Dashboard = () => {
  const [hideBalance, setHideBalance] = useState(false);
  const [userBalance, setUserBalance] = useState({
    currencyCode: "",
    balance: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getWalletBalance();
      console.log(response);
      setUserBalance({
        currencyCode: response[0]?.currencyCode,
        balance: response[0]?.amount,
      });
    };

    fetchData();
  }, []);
  return (
    <div>
      <div className="bg-white p-4 flex justify-between items-center rounded-xl">
        <StyledText
          type="title"
          variant="medium"
        >
          Hello, {user?.fullName?.split(" ")[0]}
        </StyledText>
        <StyledText>{getFormattedDate()}</StyledText>
      </div>

      <div
        className="border rounded-xl py-5 flex flex-col items-center justify-center mt-5 gap-5"
        style={{
          backgroundColor: Colors.box,
          borderColor: Colors.boxBorder,
        }}
      >
        <div className="flex items-center justify-center gap-1">
          <EmptyWallet
            size={18}
            color={Colors.primary}
            variant="Bold"
          />
          <StyledText
            type="label"
            color={Colors.primary}
          >
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
            className="flex items-center gap-1 p-6 border border-primary py-2 rounded-full w-[160px] justify-center bg-white"
            style={{
              borderColor: "#4D4D4D",
              borderWidth: "0.5px",
            }}
          >
            <ReceiveSquare2
              variant="Bold"
              color={Colors.primary}
              size={25}
            />
            <StyledText type="label">Deposit</StyledText>
          </div>

          <div
            className="flex items-center gap-1 p-6 border py-2 rounded-full w-[160px] justify-center bg-white"
            style={{ borderColor: "#4D4D4D", borderWidth: "0.5px" }}
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

      <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-5">
        <div className="bg-white rounded-xl p-6">
          <div className="flex gap-2 items-center border-b border-[#B0B0B0] pb-3">
            <Flash
              size={25}
              color={Colors.lightPrimary}
              variant="Bold"
            />
            <StyledText color={Colors.primary}>Quick Access</StyledText>
          </div>

          <ContentBox>
            <div className="flex items-center justify-between">
              <div>
                <StyledText
                  color={Colors.primary}
                  variant="semibold"
                >
                  Invest Money
                </StyledText>
                <br />
                <StyledText
                  color={Colors.primary}
                  type="label"
                >
                  Grow your wealth securely
                </StyledText>
              </div>

              <StatusUp
                size={55}
                color={Colors.lightPrimary}
                variant="Bold"
              />
            </div>
          </ContentBox>

          <ContentBox>
            <div className="flex items-center justify-between">
              <div>
                <StyledText
                  color={Colors.primary}
                  variant="semibold"
                >
                  My Portfolio
                </StyledText>
                <br />
                <StyledText
                  color={Colors.primary}
                  type="label"
                >
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
            <ContentBox>
              <ReceiptText
                size={25}
                color={Colors.lightPrimary}
                variant="Bold"
                className="my-1"
              />

              <StyledText
                color={Colors.primary}
                variant="semibold"
              >
                Transactions
              </StyledText>
              <br />
              <StyledText
                color={Colors.primary}
                type="label"
              >
                Monitor your financial activity
              </StyledText>
            </ContentBox>
            <ContentBox>
              <Reserve
                size={25}
                color={Colors.lightPrimary}
                variant="Bold"
                className="my-1"
              />

              <StyledText
                color={Colors.primary}
                variant="semibold"
              >
                Help Desk
              </StyledText>
              <br />
              <StyledText
                color={Colors.primary}
                type="label"
              >
                Reliable support when you need it
              </StyledText>
            </ContentBox>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6">
          <div className="flex gap-2 items-center border-b border-[#B0B0B0] pb-3">
            <ReceiptText
              size={25}
              color={Colors.lightPrimary}
              variant="Bold"
            />
            <StyledText color={Colors.primary}>Recent Transactions</StyledText>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

const ContentBox = ({ children }) => {
  return <div className="p-4 rounded-xl bg-[#ECF9FF] my-3">{children}</div>;
};
