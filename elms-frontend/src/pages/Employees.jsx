
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Employees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    phone: "",
  });

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load employees"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      department: "",
      designation: "",
      phone: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingId) {
        await api.put(`/employees/${editingId}`, form);
        setMessage("Employee updated successfully.");
      } else {
        await api.post("/employees", form);
        setMessage("Employee added successfully.");
      }

      resetForm();
      await fetchEmployees();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save employee"
      );
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setForm({
      name: employee.name || "",
      email: employee.email || "",
      department: employee.department || "",
      designation: employee.designation || "",
      phone: employee.phone || "",
    });
    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete employee #${id}?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await api.delete(`/employees/${id}`);

      setMessage("Employee deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await fetchEmployees();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete employee"
      );
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>ELMS</h2>
        <p>Manager Portal</p>

        <nav>
          <a onClick={() => navigate("/manager-dashboard")}>
            Dashboard
          </a>
          <a className="active">Employees</a>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Employee Management</h1>
            <p>Manage employee records and information.</p>
          </div>
        </header>

        <section className="dashboard-section">
          <h2>{editingId ? "Update Employee" : "Add New Employee"}</h2>

          {message && (
            <p className="success-message">{message}</p>
          )}

          {error && (
            <p className="error-message">{error}</p>
          )}

          <form className="employee-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Employee Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="department"
              placeholder="Department"
              value={form.department}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={form.designation}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <div className="employee-form-actions">
              <button
                type="submit"
                className="employee-submit-btn"
              >
                {editingId ? "Update Employee" : "Add Employee"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="employee-cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="dashboard-section">
          <h2>Employee List ({employees.length})</h2>

          {loading ? (
            <p>Loading employees...</p>
          ) : employees.length === 0 ? (
            <p>No employees found. Add your first employee above.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>#{employee.id}</td>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.department}</td>
                      <td>{employee.designation}</td>
                      <td>{employee.phone}</td>

                      <td>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(employee)}
                        >
                          Edit
                        </button>

                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(employee.id)}
                        >
                          Delete
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

export default Employees;
