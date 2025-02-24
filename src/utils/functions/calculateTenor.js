export const calculateTenor = (investmentDate, maturityDate) => {
  const startDate = new Date(investmentDate);
  const endDate = new Date(maturityDate);

  const timeDifference = endDate - startDate;

  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

  return daysDifference;
};
