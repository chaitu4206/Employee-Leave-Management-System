
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyLeaves() {
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await api.get("/leaves/my");
        setLeaves(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load leave requests"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>ELMS</h2>
        <p>Employee Portal</p>

        <nav>
          <a onClick={() => navigate("/employee-dashboard")}>Dashboard</a>
          <a onClick={() => navigate("/apply-leave")}>Apply Leave</a>
          <a className="active">My Leaves</a>
          <a onClick={() => navigate("/leave-balance")}>Leave Balance</a>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>My Leave Requests</h1>
            <p>Track your leave applications and their status.</p>
          </div>
        </header>

        <section className="dashboard-section">
          <h2>Leave History</h2>

          {loading ? (
            <p>Loading leave requests...</p>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : leaves.length === 0 ? (
            <p>You haven't submitted any leave requests yet.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave.id}>
                      <td>#{leave.id}</td>
                      <td>{leave.leaveType}</td>
                      <td>{leave.startDate}</td>
                      <td>{leave.endDate}</td>
                      <td>{leave.reason}</td>
                      <td>
                        <span className={`status ${leave.status.toLowerCase()}`}>
                          {leave.status}
                        </span>
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

export default MyLeaves;
