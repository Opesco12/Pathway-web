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
} from "iconsax-react";
import { useState, useEffect } from "react";

import StyledText from "../component/ui/StyledText";
import { Colors } from "../constants/Color";

import { amountFormatter } from "../utils/amountFormatter";
import { useAuth } from "../context/UserContext";
import { getFormattedDate } from "../utils/functions/date";
import { getWalletBalance } from "../api/apiClient";
import { MoveDownLeft, MoveUpRight } from "lucide-react";
import AppModal from "../component/ui/AppModal";
import { useData } from "../context/DataContext";

const Dashboard = () => {
  const [hideBalance, setHideBalance] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  // const [userBalance, setUserBalance] = useState({
  //   currencyCode: "",
  //   balance: 0,
  // });
  const { user } = useAuth();
  const { userBalance } = useData();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await getWalletBalance();
  //     console.log(response);
  //     setUserBalance({
  //       currencyCode: response[0]?.currencyCode,
  //       balance: response[0]?.amount,
  //     });
  //   };

  //   fetchData();
  // }, []);
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

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6">
          <div className="flex items-center gap-2 border-b border-[#B0B0B0] pb-3">
            <Flash size={25} color={Colors.lightPrimary} variant="Bold" />
            <StyledText color={Colors.primary}>Quick Access</StyledText>
          </div>

          <ContentBox>
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

          <ContentBox>
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
            <ContentBox>
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
            <ContentBox>
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

        <div className="rounded-xl bg-white p-6">
          <div className="flex items-center gap-2 border-b border-[#B0B0B0] pb-3">
            <ReceiptText size={25} color={Colors.lightPrimary} variant="Bold" />
            <StyledText color={Colors.primary}>Recent Transactions</StyledText>
          </div>

          <div className="flex items-center gap-3 border-b border-[#B0B0B0] py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF6347]">
              <MoveUpRight color="#fff" />
            </div>
            <div className="flex flex-1 items-center justify-between">
              <div>
                <StyledText variant="semibold" color={Colors.primary}>
                  Pathway lifestyle plan
                </StyledText>{" "}
                <br />
                <StyledText type="label" color={Colors.light}>
                  Investment - 22 Feb 2025
                </StyledText>
              </div>
              <StyledText variant="semibold" color={Colors.primary}>
                {amountFormatter.format(200000)}
              </StyledText>
            </div>
          </div>

          <div className="flex items-center gap-3 border-b border-[#B0B0B0] py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF6347]">
              <MoveUpRight color="#fff" />
            </div>
            <div className="flex flex-1 items-center justify-between">
              <div>
                <StyledText variant="semibold" color={Colors.primary}>
                  Pathway lifestyle plan
                </StyledText>{" "}
                <br />
                <StyledText type="label" color={Colors.light}>
                  Investment - 22 Feb 2025
                </StyledText>
              </div>
              <StyledText variant="semibold" color={Colors.primary}>
                {amountFormatter.format(200000)}
              </StyledText>
            </div>
          </div>

          <div className="flex items-center gap-3 border-b border-[#B0B0B0] py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF6347]">
              <MoveUpRight color="#fff" />
            </div>
            <div className="flex flex-1 items-center justify-between">
              <div>
                <StyledText variant="semibold" color={Colors.primary}>
                  Pathway lifestyle plan
                </StyledText>{" "}
                <br />
                <StyledText type="label" color={Colors.light}>
                  Investment - 22 Feb 2025
                </StyledText>
              </div>
              <StyledText variant="semibold" color={Colors.primary}>
                {amountFormatter.format(200000)}
              </StyledText>
            </div>
          </div>

          <div className="flex items-center gap-3 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#64CF69]">
              <MoveDownLeft color="#fff" />
            </div>
            <div className="flex flex-1 items-center justify-between">
              <div>
                <StyledText variant="semibold" color={Colors.primary}>
                  Pathway lifestyle plan
                </StyledText>{" "}
                <br />
                <StyledText type="label" color={Colors.light}>
                  Investment - 22 Feb 2025
                </StyledText>
              </div>
              <StyledText variant="semibold" color={Colors.primary}>
                {amountFormatter.format(200000)}
              </StyledText>
            </div>
          </div>
        </div>
      </div>

      <AppModal
        title={"Deposit"}
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
      />

      <AppModal
        title={"Withdrawal"}
        isOpen={isWithdrawalModalOpen}
        onClose={() => setIsWithdrawalModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;

const ContentBox = ({ children }) => {
  return <div className="my-3 rounded-xl bg-[#ECF9FF] p-4">{children}</div>;
};
