import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useMentor } from "../context/MentorContext";
import { useAdmin } from "../context/AdminContext";

export default function ProtectedRoute({ children, role }) {
  if (role === "user") {
    const { token } = useUser();
    return token ? children : <Navigate to="/user/login" replace />;
  }

  if (role === "mentor") {
    const { token } = useMentor();
    return token ? children : <Navigate to="/mentor/login" replace />;
  }

  if (role === "admin") {
    const { token } = useAdmin();
    return token ? children : <Navigate to="/admin/login" replace />;
  }

  return <Navigate to="/" replace />;
}
