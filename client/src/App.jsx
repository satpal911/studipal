import React, { useEffect, useRef } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Courses from "./pages/Courses";
import About from "./pages/About";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MentorLogin from "./pages/MentorLogin";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import Dashboard from "./pages/userDashboard";
import LandingPage from "./pages/LandingPage";
import Contact from "./pages/Contact";
import CourseLessons from "./pages/CourseLesson";
import { Toaster } from "react-hot-toast";
import {API} from "./api"
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectedRef = useRef(false);

  useEffect(() => {
    // Reset redirect when logout
    if (
      location.pathname === "/" ||
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    ) {
      redirectedRef.current = false;
    }

    // Prevent repeated redirects
    if (redirectedRef.current) return;

    const publicPaths = [
      "/",
      "/user/login",
      "/user/register",
      "/mentor/login",
      "/admin/login",
      "/about",
      "/contact",
      "/courses",
    ];

    const isPublic = publicPaths.includes(location.pathname);

    // Get tokens
    const adminToken = localStorage.getItem("adminToken");
    const mentorToken = localStorage.getItem("mentorToken");
    const userToken = localStorage.getItem("userToken");

    if (isPublic) {
      if (adminToken) {
        redirectedRef.current = true;
        navigate("/admin/dashboard", { replace: true });
      } else if (mentorToken) {
        redirectedRef.current = true;
        navigate("/mentor/dashboard", { replace: true });
      } else if (userToken) {
        redirectedRef.current = true;
        navigate("/user/dashboard", { replace: true });
      }
    }
  }, [location.pathname, navigate]);

  return (
    <div>
      <Navbar />
      <Toaster position="top-center" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/mentor/login" element={<MentorLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Dashboards */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/mentor/dashboard" element={<MentorDashboard />} />
        <Route path="/user/dashboard" element={<Dashboard />} />

        {/* Lessons */}
        <Route path="/course/:courseId/lessons" element={<CourseLessons />} />
      </Routes>
    </div>
  );
}
