import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useMentor } from "../context/MentorContext";
import { useAdmin } from "../context/AdminContext";

export default function PublicRoute({ children, role }) {
  const { token: userToken } = useUser();
  const { token: mentorToken } = useMentor();
  const { token: adminToken } = useAdmin();

  if (role === "user" && userToken) return <Navigate to="/user/dashboard" replace />;
  if (role === "mentor" && mentorToken) return <Navigate to="/mentor/dashboard" replace />;
  if (role === "admin" && adminToken) return <Navigate to="/admin/dashboard" replace />;

  return children;
}
