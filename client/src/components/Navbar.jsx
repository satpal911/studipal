import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const location = useLocation();
  const { user } = useUser(); // 👈 logged-in user from context

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleCloseMenu = () => {
    setIsOpen(false);
    setLoginOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/courses", label: "Courses" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path) => location.pathname === path;

  // 🚨 Hide Navbar only on dashboards
  if (
    location.pathname.startsWith("/user/dashboard") ||
    location.pathname.startsWith("/mentor/dashboard") ||
    location.pathname.startsWith("/admin/dashboard") ||
    location.pathname.startsWith("/course-lessons") ||
    location.pathname.includes("/course/") && location.pathname.includes("/lessons")
  ) {
    return null;
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              Studipal
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`${
                  isActive(link.to)
                    ? "text-indigo-600 font-semibold"
                    : "text-gray-700 hover:text-indigo-600"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* ✅ Show Login dropdown only if NOT logged in */}
            {!user && (
              <div className="relative">
                <button
                  onClick={() => setLoginOpen(!loginOpen)}
                  className="flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100"
                >
                  Login <ChevronDown className="ml-1 w-4 h-4" />
                </button>

                {loginOpen && (
                  <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg w-40">
                    <Link
                      to="/user/login"
                      onClick={handleCloseMenu}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      User
                    </Link>
                    <Link
                      to="/mentor/login"
                      onClick={handleCloseMenu}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Mentor
                    </Link>
                    <Link
                      to="/admin/login"
                      onClick={handleCloseMenu}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Admin
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={handleCloseMenu}
                className={`block ${
                  isActive(link.to)
                    ? "text-indigo-600 font-semibold"
                    : "text-gray-700 hover:text-indigo-600"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* ✅ Show Login dropdown only if NOT logged in */}
            {!user && (
              <div>
                <button
                  onClick={() => setLoginOpen(!loginOpen)}
                  className="w-full flex justify-between items-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                >
                  Login
                  <ChevronDown
                    className={`ml-2 w-4 h-4 transform transition-transform ${
                      loginOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {loginOpen && (
                  <div className="mt-2 bg-white border rounded-lg shadow-lg">
                    <Link
                      to="/user/login"
                      onClick={handleCloseMenu}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      User
                    </Link>
                    <Link
                      to="/mentor/login"
                      onClick={handleCloseMenu}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Mentor
                    </Link>
                    <Link
                      to="/admin/login"
                      onClick={handleCloseMenu}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Admin
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
