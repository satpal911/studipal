import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { useUser } from "../context/UserContext";
import { useMentor } from "../context/MentorContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const location = useLocation();

  // detect role
  const role = localStorage.getItem("role");

  // ✅ call hooks always at top
  const { admin, logout: adminLogout } = useAdmin() || {};
  const { mentor, logout: mentorLogout } = useMentor() || {};
  const { user, logout: userLogout } = useUser() || {};

  let name = null;
  let logoutFn = null;

  if (role === "admin") {
    name = admin?.name || "Admin";
    logoutFn = adminLogout;
  } else if (role === "mentor") {
    name = mentor?.name || "Mentor";
    logoutFn = mentorLogout;
  } else if (role === "user") {
    name = user?.name || "User";
    logoutFn = userLogout;
  }

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

            {/* Login or Logout */}
            {!logoutFn ? (
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
            ) : (
              <button
                onClick={logoutFn}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
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

            {/* Mobile Login or Logout */}
            {!logoutFn ? (
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
            ) : (
              <button
                onClick={() => {
                  logoutFn();
                  handleCloseMenu();
                }}
                className="flex items-center w-full justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
