
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function ManagerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const fetchPendingLeaves = async () => {
    try {
      const response = await api.get("/leaves/pending");
      setLeaves(response.data);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load pending leave requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  const updateStatus = async (id, status) => {
    const action = status === "APPROVED" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} leave request #${id}?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);
      setMessage("");
      setError("");

      await api.put(`/leaves/${id}/status`, { status });

      setMessage(
        `Leave request #${id} ${status.toLowerCase()} successfully.`
      );

      await fetchPendingLeaves();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update leave request"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>ELMS</h2>
        <p>Manager Portal</p>

        <nav>
          <a
            className="active"
            onClick={() => navigate("/manager-dashboard")}
          >
            Dashboard
          </a>

          <a onClick={() => navigate("/employees")}>
            Employees
          </a>
        </nav>

        <button onClick={handleLogout}>Logout</button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Manager Dashboard</h1>
            <p>Welcome, {user?.name || "Manager"}</p>
          </div>
        </header>

        <section className="dashboard-section">
          <h2>Pending Leave Requests ({leaves.length})</h2>

          {message && (
            <p className="success-message">{message}</p>
          )}

          {error && (
            <p className="error-message">{error}</p>
          )}

          {loading ? (
            <p>Loading requests...</p>
          ) : leaves.length === 0 ? (
            <p>No pending leave requests.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Employee Email</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave.id}>
                      <td>#{leave.id}</td>
                      <td>{leave.employeeEmail}</td>
                      <td>{leave.leaveType}</td>
                      <td>{leave.startDate}</td>
                      <td>{leave.endDate}</td>
                      <td>{leave.reason}</td>

                      <td>
                        <button
                          className="action-btn approve-btn"
                          disabled={processingId === leave.id}
                          onClick={() =>
                            updateStatus(leave.id, "APPROVED")
                          }
                        >
                          {processingId === leave.id
                            ? "Processing..."
                            : "Approve"}
                        </button>

                        <button
                          className="action-btn reject-btn"
                          disabled={processingId === leave.id}
                          onClick={() =>
                            updateStatus(leave.id, "REJECTED")
                          }
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ManagerDashboard;
