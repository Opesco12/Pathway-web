import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { amountFormatter } from "../utils/amountFormatter";
import { Colors } from "../constants/Color";
import StyledText from "../component/ui/StyledText";

const TransactionDetails = () => {
  const [transaction, setTransaction] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const transaction = location.state;
    console.log(transaction);
    setTransaction(transaction);

    if (!transaction) navigate("/transactions");
  }, []);

  const date = new Date(transaction?.valueDate).toDateString();
  return (
    <div className="flex h-full flex-col">
      <StyledText
        variant="semibold"
        type="heading"
        color={Colors.primary}
        className="my-4"
      >
        Transaction History
      </StyledText>

      <div className="flex-1 rounded-xl bg-white p-5 md:p-3 lg:p-5">
        <div className="my-[20px] flex flex-col items-center">
          <StyledText
            variant="semibold"
            type="title"
            className={"text-center"}
            color={Colors.primary}
          >
            {transaction?.description}
          </StyledText>
          <StyledText
            variant="medium"
            color={Colors.light}
            className={"my-[10px]"}
          >
            {date}
          </StyledText>
          <br />
          <StyledText variant="semibold" type="heading" color={Colors.primary}>
            {amountFormatter.format(transaction?.amount)}
          </StyledText>
          <br />
          <StyledText variant="medium" color={Colors.primary}>
            {transaction?.portfolio}
          </StyledText>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
