import React from "react";
import { ArrowLeft, ArrowRight } from "iconsax-react";

import { Colors } from "../constants/Color";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const delta = window.innerWidth < 640 ? 1 : 2;
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages !== 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <nav className="mt-4 flex flex-wrap items-center justify-center space-x-1 sm:space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-md p-1 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2"
        aria-label="Previous page"
        style={{ backgroundColor: Colors.lightPrimary }}
      >
        <ArrowLeft size={16} color={Colors.white} />
      </button>

      <div className="flex flex-wrap items-center justify-center space-x-1 sm:space-x-2">
        {getPageNumbers().map((number, index) => (
          <React.Fragment key={index}>
            {number === "..." ? (
              <span className="px-2 py-1">...</span>
            ) : (
              <button
                onClick={() => onPageChange(number)}
                className={`rounded-md px-2 py-1 text-sm sm:px-3 sm:text-base ${
                  currentPage === number
                    ? "bg-[#000050] text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {number}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-md p-1 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2"
        aria-label="Next page"
        style={{ backgroundColor: Colors.lightPrimary }}
      >
        <ArrowRight size={16} color={Colors.white} />
      </button>
    </nav>
  );
};

export default Pagination;
