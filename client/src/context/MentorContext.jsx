// src/context/MentorContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MentorContext = createContext();

export const MentorProvider = ({ children }) => {
  const [mentor, setMentor] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("mentorToken"));
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Login mentor
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/mentor/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.data?.token) {
        // Save token in state + localStorage
        setToken(res.data.token);
        localStorage.setItem("mentorToken", res.data.token);
        localStorage.setItem("role", "mentor");

        // Save mentor info (if backend sends it on login)
        if (res.data.mentor) {
          setMentor(res.data.mentor);
        }

        navigate("/mentor/dashboard");
      }
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout mentor
  const logout = () => {
    setMentor(null);
    setToken(null);
    localStorage.removeItem("mentorToken");
    localStorage.removeItem("role");
    navigate("/mentor/login");
  };

  // ✅ Auto fetch mentor info when token exists
  useEffect(() => {
    const fetchMentor = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:3000/api/v1/mentor/me", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        // backend returns { mentor } or mentor object
        setMentor(res.data.mentor || res.data);
      } catch (error) {
        console.error("Mentor fetch failed:", error);
        logout();
      }
    };
    fetchMentor();
  }, [token]);

  return (
    <MentorContext.Provider value={{ mentor, token, login, logout, loading }}>
      {children}
    </MentorContext.Provider>
  );
};

export const useMentor = () => useContext(MentorContext);
