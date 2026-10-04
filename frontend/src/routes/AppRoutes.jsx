import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateComplaint from "../pages/CreateComplaint";
import MyComplaints from "../pages/MyComplaints";
import ComplaintDetails from "../pages/ComplaintDetails";
import Profile from "../pages/Profile";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected citizen routes */}
      <Route element={<ProtectedRoute />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/create-complaint"
          element={<CreateComplaint />}
        />

        <Route
          path="/my-complaints"
          element={<MyComplaints />}
        />

        <Route
          path="/complaints/:id"
          element={<ComplaintDetails />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

      </Route>

    </Routes>
  );
}

export default AppRoutes;