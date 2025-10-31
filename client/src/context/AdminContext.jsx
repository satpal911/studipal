// src/context/AdminContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/admin/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.data?.token) {
        setToken(res.data.token);
        setAdmin(res.data.admin);
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("role", "admin");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:3000/api/v1/admin/me", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setAdmin(res.data);
      } catch (error) {
        console.error("Admin fetch failed:", error);
        logout();
      }
    };
    fetchAdmin();
  }, [token]);

  return (
    <AdminContext.Provider value={{ admin, token, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
