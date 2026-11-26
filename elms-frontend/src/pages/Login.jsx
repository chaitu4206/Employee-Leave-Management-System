
import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedRole = searchParams.get("role") || "EMPLOYEE";
  const isManagerLogin = selectedRole === "MANAGER";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      // Validate the selected login type
      if (isManagerLogin) {
        if (user.role !== "MANAGER" && user.role !== "ADMIN") {
          setError("Access denied! Please login using Employee Login.");
          return;
        }

        navigate("/manager-dashboard");
      } else {
        if (user.role !== "EMPLOYEE") {
          setError("Please use Manager Login for this account.");
          return;
        }

        navigate("/employee-dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>ELMS</h1>

        <h2>
          {isManagerLogin ? "Manager Login" : "Employee Login"}
        </h2>

        <p>Sign in to continue</p>

        {error && <div className="error-message">{error}</div>}

        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        {!isManagerLogin && (
          <p>
            Don't have an account?{" "}
            <Link to="/register">Register</Link>
          </p>
        )}

        <p>
          <Link to="/">Back to Home</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
