
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ApplyLeave from "./pages/ApplyLeave";
import MyLeaves from "./pages/MyLeaves";
import LeaveBalance from "./pages/LeaveBalance";
import ManagerDashboard from "./pages/ManagerDashboard";
import Employees from "./pages/Employees";

// Redirect users to their respective dashboards
function getDashboardPath(role) {
  if (role === "MANAGER" || role === "ADMIN") {
    return "/manager-dashboard";
  }

  return "/employee-dashboard";
}

// Protect routes based on user roles
function RoleRoute({ allowedRoles, children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return (
      <Navigate
        to={getDashboardPath(user?.role)}
        replace
      />
    );
  }

  return children;
}

// Redirect authenticated users away from login/register
function PublicRoute({ children }) {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <Navigate
        to={getDashboardPath(user?.role)}
        replace
      />
    );
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<Home />} />

      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Employee Routes */}
      <Route
        path="/employee-dashboard"
        element={
          <RoleRoute allowedRoles={["EMPLOYEE"]}>
            <EmployeeDashboard />
          </RoleRoute>
        }
      />

      <Route
        path="/apply-leave"
        element={
          <RoleRoute allowedRoles={["EMPLOYEE"]}>
            <ApplyLeave />
          </RoleRoute>
        }
      />

      <Route
        path="/my-leaves"
        element={
          <RoleRoute allowedRoles={["EMPLOYEE"]}>
            <MyLeaves />
          </RoleRoute>
        }
      />

      <Route
        path="/leave-balance"
        element={
          <RoleRoute allowedRoles={["EMPLOYEE"]}>
            <LeaveBalance />
          </RoleRoute>
        }
      />

      {/* Manager and Admin Routes */}
      <Route
        path="/manager-dashboard"
        element={
          <RoleRoute allowedRoles={["MANAGER", "ADMIN"]}>
            <ManagerDashboard />
          </RoleRoute>
        }
      />

      <Route
        path="/employees"
        element={
          <RoleRoute allowedRoles={["MANAGER", "ADMIN"]}>
            <Employees />
          </RoleRoute>
        }
      />

      {/* Unknown Routes */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
