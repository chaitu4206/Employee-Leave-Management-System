
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <Navigate
        to={
          user.role === "MANAGER" || user.role === "ADMIN"
            ? "/manager-dashboard"
            : "/employee-dashboard"
        }
        replace
      />
    );
  }

  return (
    <div className="home-page">
      <nav className="home-navbar">
        <Link to="/" className="brand">
          <div className="brand-icon">E</div>
          <span>ELMS</span>
        </Link>

        <div className="nav-right">
          <span>Already registered?</span>
          <Link to="/login?role=EMPLOYEE" className="nav-login">
            Sign In
          </Link>
        </div>
      </nav>

      <main className="home-main">
        <section className="home-hero">
          <div className="hero-tag">
            <span className="hero-dot"></span>
            SMART WORKPLACE MANAGEMENT
          </div>

          <h1>
            Leave management,
            <span> made simple.</span>
          </h1>

          <p className="hero-description">
            A smarter way to manage employee leave applications,
            approvals and leave balances. Everything your
            workplace needs, in one place.
          </p>
        </section>

        <section className="portal-section">
          <div className="section-heading">
            <h2>Choose your portal</h2>
            <p>Select your account type to continue</p>
          </div>

          <div className="portal-grid">
            <div className="portal-card employee-card">
              <div className="portal-icon employee-icon">
                <span>👨‍💼</span>
              </div>

              <div className="portal-label">EMPLOYEE PORTAL</div>
              <h3>Employee Login</h3>

              <p>
                Manage your leave applications, check your
                remaining balance and track request status.
              </p>

              <ul>
                <li>Apply for leave online</li>
                <li>Track application status</li>
                <li>View leave balance</li>
              </ul>

              <Link
                to="/login?role=EMPLOYEE"
                className="portal-button employee-btn"
              >
                Continue as Employee <span>→</span>
              </Link>
            </div>

            <div className="portal-card manager-card">
              <div className="portal-icon manager-icon">
                <span>🛡️</span>
              </div>

              <div className="portal-label">MANAGEMENT PORTAL</div>
              <h3>Manager Login</h3>

              <p>
                Manage employee records, review leave requests
                and make approval decisions.
              </p>

              <ul>
                <li>Manage employee records</li>
                <li>Review pending applications</li>
                <li>Approve or reject leave</li>
              </ul>

              <Link
                to="/login?role=MANAGER"
                className="portal-button manager-btn"
              >
                Continue as Manager <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        <div className="registration-banner">
          <div>
            <h3>New to ELMS?</h3>
            <p>Create your employee account to get started.</p>
          </div>

          <Link to="/register" className="register-button">
            Create Account →
          </Link>
        </div>
      </main>

      <footer className="home-footer">
        <span>© 2026 ELMS — Employee Leave Management System</span>
        <span>Simple. Secure. Efficient.</span>
      </footer>
    </div>
  );
}

export default Home;
