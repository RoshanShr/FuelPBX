import { useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useGetReports } from "../../api/reports/getReportsApi";
import Pagination from "../../common/Pagination"; // Import the pagination component
import moment from "moment";

const Reports = () => {
  const loggedData = useContext(UserContext);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15); // Default 10 items per page
  const [dispositionFilter, setDispositionFilter] = useState("All");
  const [callTypeFilter, setCallTypeFilter] = useState("All");

  // Fetch paginated data from the backend
  const {
    data: reportsData,
    isLoading,
    isError,
    error,
  } = useGetReports(
    loggedData,
    currentPage,
    itemsPerPage,
    dispositionFilter,
    callTypeFilter
  );

  // Extract data and pagination metadata from the backend response
  const reports = reportsData?.data || [];
  const totalItems = reportsData?.totalItems || 0;

  // Handle change in items per page
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage); // Update the number of items per page
    setCurrentPage(1); // Reset to the first page when the number of items per page changes
  };

  const handleDispositionChange = (event) => {
    setDispositionFilter(event.target.value);
  };

  const handleCallTypeChange = (event) => {
    setCallTypeFilter(event.target.value);
  };

  return (
    <div className="flex-grow-1 h-100 p-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active" aria-current="page">
            Reports
          </li>
        </ol>
      </nav>
      <div className="d-flex mb-3 align-items-center">
        <div className="me-3">
          <label htmlFor="dispositionFilter" className="form-label">
            Disposition
          </label>
          <select
            id="dispositionFilter"
            className="form-select"
            value={dispositionFilter}
            onChange={handleDispositionChange}
          >
            <option value="All">All</option>
            <option value="ANSWERED">Answered</option>
            <option value="NOANSWER">No Answer</option>
            <option value="BUSY">Busy</option>
            <option value="FAILED">Failed</option>
            <option value="CANCEL">Canceled</option>
          </select>
        </div>

        {/* Call Type Filter */}
        <div>
          <label htmlFor="callTypeFilter" className="form-label">
            Call Type
          </label>
          <select
            id="callTypeFilter"
            className="form-select"
            value={callTypeFilter}
            onChange={handleCallTypeChange}
          >
            <option value="All">All</option>
            <option value="Inbound">Inbound</option>
            <option value="Outbound">Outbound</option>
          </select>
        </div>
      </div>

      <div className="d-flex" style={{ height: "calc(100% - 174px)" }}>
        <div className="overflow-auto flex-grow-1">
          <table className="table overflow-auto">
            <thead>
              <tr>
                <th>Calldate</th>
                <th>Call type</th>
                <th>Agent</th>
                <th>Destination</th>
                <th>Disposition</th>
                <th>Duration</th>
                <th>Recording</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6">Loading...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan="6">Error: {error.message}</td>
                </tr>
              ) : reports.length > 0 ? (
                reports.map((client) => (
                  <tr key={client.id}>
                    <td>
                      {moment(client.start_time).format(
                        "dddd, MMMM Do YYYY, h:mm:ss a"
                      )}
                    </td>
                    <td>{client.call_type}</td>
                    <td>{client.caller_id}</td>
                    <td>{client.destination}</td>
                    <td>
                      {client.disposition === "ANSWERED" ? (
                        <span className="badge bg-success">
                          {client.disposition}
                        </span>
                      ) : (
                        <span
                          className={
                            client.disposition !== "" &&
                            client.disposition != null
                              ? "badge bg-danger"
                              : "badge bg-warning"
                          }
                        >
                          {client.disposition !== "" &&
                          client.disposition != null
                            ? client.disposition
                            : "NO ANSWER"}
                        </span>
                      )}
                    </td>
                    <td>{client.duration}</td>
                    <td>
                      {client.recording && client.disposition === "ANSWERED" ? (
                        <div>
                          <audio controls>
                            <source
                              src={`/records/${loggedData.loggedUser.alias}/${client.recording}`}
                              type="audio/mpeg"
                            />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      ) : (
                        "No Recording"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No reports available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Component */}
      {!isLoading && !isError && (
        // <div className="sticky-pagination">
        <div>
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange} // Pass the function to handle per page change
          />
        </div>
      )}
    </div>
  );
};

export default Reports;
