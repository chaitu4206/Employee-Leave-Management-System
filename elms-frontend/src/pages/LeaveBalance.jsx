
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function LeaveBalance() {
  const navigate = useNavigate();
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const response = await api.get("/balances/my");
        setBalances(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load leave balances"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, []);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>ELMS</h2>
        <p>Employee Portal</p>

        <nav>
          <a onClick={() => navigate("/employee-dashboard")}>Dashboard</a>
          <a onClick={() => navigate("/apply-leave")}>Apply Leave</a>
          <a onClick={() => navigate("/my-leaves")}>My Leaves</a>
          <a className="active">Leave Balance</a>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>My Leave Balance</h1>
            <p>View your available and used leave days.</p>
          </div>
        </header>

        <section className="dashboard-section">
          <h2>Leave Summary</h2>

          {loading ? (
            <p>Loading leave balances...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>Total Days</th>
                    <th>Used Days</th>
                    <th>Remaining Days</th>
                    <th>Year</th>
                  </tr>
                </thead>

                <tbody>
                  {balances.map((balance) => (
                    <tr key={balance.id}>
                      <td>{balance.leaveType}</td>
                      <td>{balance.totalDays}</td>
                      <td>{balance.usedDays}</td>
                      <td>{balance.remainingDays}</td>
                      <td>{balance.year}</td>
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

export default LeaveBalance;
