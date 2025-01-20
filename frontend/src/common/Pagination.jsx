const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const range = 2; // Number of page numbers to show around the current page

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = parseInt(event.target.value, 10);
    onItemsPerPageChange(newItemsPerPage);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 7) {
      // Show all page numbers if total pages are 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(renderPageButton(i));
      }
    } else {
      // Always show the first page
      pageNumbers.push(renderPageButton(1));

      // Add ellipsis if current page is far from the start
      if (currentPage > range + 2) {
        pageNumbers.push(<span key="start-ellipsis" className="px-2">...</span>);
      }

      // Add pages around the current page
      const start = Math.max(2, currentPage - range);
      const end = Math.min(totalPages - 1, currentPage + range);

      for (let i = start; i <= end; i++) {
        pageNumbers.push(renderPageButton(i));
      }

      // Add ellipsis if current page is far from the end
      if (currentPage < totalPages - range - 1) {
        pageNumbers.push(<span key="end-ellipsis" className="px-2">...</span>);
      }

      // Always show the last page
      pageNumbers.push(renderPageButton(totalPages));
    }

    return pageNumbers;
  };

  const renderPageButton = (page) => (
    <button
      key={page}
      onClick={() => handlePageClick(page)}
      className={`btn btn-sm ${
        page === currentPage ? "btn-primary" : "btn-light"
      } px-3 py-1`}
    >
      {page}
    </button>
  );

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
        <label
          htmlFor="itemsPerPage"
          className="text-sm"
          style={{ width: "115px" }}
        >
          Show per page:
        </label>
        <select
          style={{ width: "80px" }}
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="form-select"
        >
          {[5, 10, 20, 50].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
