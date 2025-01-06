import React from "react";

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const range = 2; // How many page numbers to show around the current page

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page); // No debounce, request happens immediately
    }
  };

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = parseInt(event.target.value, 10);
    onItemsPerPageChange(newItemsPerPage); // Notify parent component about the change
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const start = Math.max(1, currentPage - range);
    const end = Math.min(totalPages, currentPage + range);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`btn btn-sm ${
            i === currentPage ? "btn-primary" : "btn-light"
          } px-3 py-1`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="d-flex justify-content-between align-items-center mt-0">
      {/* Pagination controls */}
      <div className="d-flex align-items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          className="btn btn-sm btn-light px-3 py-2"
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {/* Render Page Numbers */}
        {renderPageNumbers()}

        {/* Next Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          className="btn btn-sm btn-light px-4 py-2"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* "Show per page" Dropdown */}
      <div className="d-flex align-items-center space-x-2">
        <label htmlFor="itemsPerPage" className="text-sm"  style={{ width: "115px" }}>
          Show per page:
        </label>
        <select style={{ width: "80px" }}
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="form-select"
        >
          {[5, 10, 15, 20, 50, 100, 200, 300, 500].map((option) => (
            
            <option key={option} value={option} >
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
