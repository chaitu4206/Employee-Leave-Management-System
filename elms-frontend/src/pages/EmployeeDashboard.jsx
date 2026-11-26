
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [balances, setBalances] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [balanceResponse, leaveResponse] = await Promise.all([
          api.get("/balances/my"),
          api.get("/leaves/my"),
        ]);

        setBalances(balanceResponse.data);
        setLeaves(leaveResponse.data);
      } catch (error) {
        console.error("Dashboard loading failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalRemaining = balances.reduce(
    (sum, balance) => sum + balance.remainingDays,
    0
  );

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "PENDING"
  ).length;

  const approvedLeaves = leaves.filter(
    (leave) => leave.status === "APPROVED"
  ).length;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>ELMS</h2>
        <p>Employee Portal</p>

        <nav>
          <a className="active">Dashboard</a>
          <a onClick={() => navigate("/apply-leave")}>Apply Leave</a>
          <a onClick={() => navigate("/my-leaves")}>My Leaves</a>
          <a onClick={() => navigate("/leave-balance")}>Leave Balance</a>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Employee Dashboard</h1>
            <p>Welcome back, {user?.name || "Employee"}!</p>
          </div>
          <div className="user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "E"}
          </div>
        </header>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
            <section className="stats-grid">
              <div className="stat-card">
                <p>Total Remaining Leaves</p>
                <h2>{totalRemaining}</h2>
              </div>

              <div className="stat-card">
                <p>Pending Requests</p>
                <h2>{pendingLeaves}</h2>
              </div>

              <div className="stat-card">
                <p>Approved Requests</p>
                <h2>{approvedLeaves}</h2>
              </div>
            </section>

            <section className="dashboard-section">
              <h2>My Leave Balance</h2>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Leave Type</th>
                      <th>Total Days</th>
                      <th>Used Days</th>
                      <th>Remaining Days</th>
                    </tr>
                  </thead>

                  <tbody>
                    {balances.map((balance) => (
                      <tr key={balance.id}>
                        <td>{balance.leaveType}</td>
                        <td>{balance.totalDays}</td>
                        <td>{balance.usedDays}</td>
                        <td>{balance.remainingDays}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="dashboard-section">
              <h2>Recent Leave Requests</h2>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Leave Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leaves.map((leave) => (
                      <tr key={leave.id}>
                        <td>{leave.leaveType}</td>
                        <td>{leave.startDate}</td>
                        <td>{leave.endDate}</td>
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
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default EmployeeDashboard;
