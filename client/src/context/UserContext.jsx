// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("userToken"));
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Register user
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/register",
        { name, email, password },
        { withCredentials: true }
      );

      if (res.data?.token) {
        // auto login after register
        setToken(res.data.token);
        localStorage.setItem("userToken", res.data.token);
        localStorage.setItem("role", "user");

        if (res.data.user) setUser(res.data.user);

        navigate("/user/dashboard");
      }
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.data?.token) {
        setToken(res.data.token);
        localStorage.setItem("userToken", res.data.token);
        localStorage.setItem("role", "user");

        if (res.data.user) setUser(res.data.user);

        navigate("/user/dashboard");
      }
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout user
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("role");
    navigate("/user/login");
  };

  // ✅ Auto fetch user info when token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:3000/api/v1/user/me", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setUser(res.data); // backend should send user object
      } catch (error) {
        console.error("User fetch failed:", error);
        logout(); // clear invalid token
      }
    };
    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider
      value={{ user, token, register, login, logout, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
