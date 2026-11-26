
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ApplyLeave() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    leaveType: "CASUAL",
    reason: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (form.endDate < form.startDate) {
      setError("End date cannot be before start date");
      return;
    }

    setLoading(true);

    try {
      await api.post("/leaves", form);

      setMessage("Leave application submitted successfully!");

      setForm({
        startDate: "",
        endDate: "",
        leaveType: "CASUAL",
        reason: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to submit leave application"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>ELMS</h2>
        <p>Employee Portal</p>

        <nav>
          <a onClick={() => navigate("/employee-dashboard")}>Dashboard</a>
          <a className="active">Apply Leave</a>
          <a onClick={() => navigate("/my-leaves")}>My Leaves</a>
          <a onClick={() => navigate("/leave-balance")}>Leave Balance</a>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Apply for Leave</h1>
            <p>Submit a new leave request</p>
          </div>
        </header>

        <section className="dashboard-section leave-form-section">
          <h2>Leave Application Form</h2>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="leave-form">
            <label>Leave Type</label>
            <select
              name="leaveType"
              value={form.leaveType}
              onChange={handleChange}
              required
            >
              <option value="CASUAL">Casual Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="EARNED">Earned Leave</option>
            </select>

            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />

            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              min={form.startDate || undefined}
              required
            />

            <label>Reason for Leave</label>
            <textarea
              name="reason"
              placeholder="Enter your reason for leave"
              value={form.reason}
              onChange={handleChange}
              rows="4"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default ApplyLeave;
