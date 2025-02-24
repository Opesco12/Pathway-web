import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MonthYearSelector from "../component/MonthYearSelector";
import { Colors } from "../constants/Color";
import Pagination from "../component/Pagination";
import StyledText from "../component/ui/StyledText";
import Loader from "../component/ui/LoadingAnimation";
import { amountFormatter } from "../utils/amountFormatter";

import { getTransactions } from "../api/apiClient";

const Transactions = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [startdate, setStartdate] = useState(null);
  const [enddate, setEnddate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const currentDate = new Date();
    handleMonthYearChange(
      currentDate.getMonth() + 1,
      currentDate.getFullYear(),
    );
  }, []);

  const fetchTransactionsForDateRange = async (start, end) => {
    setLoading(true);
    console.log(start, end);
    try {
      const allTransactions = await getTransactions(start, end);
      setTotalPages(Math.ceil(allTransactions.length / itemsPerPage));

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedTransactions = allTransactions?.slice(
        startIndex,
        endIndex,
      );

      setTransactions(paginatedTransactions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchTransactionsForDateRange(startdate, enddate);
  };
  const handleMonthYearChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    end.setDate(end.getDate() - 1);

    const formattedStart = start.toISOString().split("T")[0];
    const formattedEnd = end.toISOString().split("T")[0];

    setStartdate(formattedStart);
    setEnddate(formattedEnd);
    setCurrentPage(1);
    fetchTransactionsForDateRange(formattedStart, formattedEnd);
  };

  if (loading) {
    return (
      <div className="flex h-[100vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

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
        <MonthYearSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onChange={handleMonthYearChange}
        />
        <div className="">
          {transactions?.map((transaction, index) => (
            <TransactionItem transaction={transaction} key={index} />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

const TransactionItem = ({ transaction }) => {
  const date = new Date(transaction?.valueDate).toDateString();
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/transaction/details", { state: transaction })}
      className="flex justify-between border-b border-gray-200 py-[15px]"
    >
      <div className="flex w-[60%] flex-col">
        <StyledText
          variant="medium"
          color={Colors.primary}
          className="block"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
            display: "inline-block",
          }}
        >
          {`${transaction?.description} - ${transaction?.portfolio}`}
        </StyledText>
        <StyledText type="label" color={Colors.light}>
          {date && date}
        </StyledText>
      </div>
      <div className="flex flex-col items-end">
        <StyledText variant="semibold" color={Colors.primary}>
          {amountFormatter.format(transaction?.amount)}
        </StyledText>
      </div>
    </div>
  );
};

export default Transactions;
