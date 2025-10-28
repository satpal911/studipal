import { useEffect, useState } from "react";
import axios from "axios";
import { useAdmin } from "../context/AdminContext";
import {
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  PlusCircle,
  LogOut,
  LayoutDashboard,
  X,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { admin, token, logout } = useAdmin();
  const [stats, setStats] = useState({});
  const [mentors, setMentors] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stats");
  const [showAddMentor, setShowAddMentor] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ NEW
  const [mentorForm, setMentorForm] = useState({
    name: "",
    email: "",
    password: "",
    expertise: "",
  });

    const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const statsRes = await axios.get(
          "http://localhost:3000/api/v1/admin/stats",
          { headers, withCredentials: true }
        );
        setStats(statsRes.data.data);

        const mentorsRes = await axios.get(
          "http://localhost:3000/api/v1/admin/all-mentors",
          { headers, withCredentials: true }
        );
        setMentors(mentorsRes.data.data || []);

        const coursesRes = await axios.get(
          "http://localhost:3000/api/v1/admin/all-courses",
          { headers, withCredentials: true }
        );
        setAllCourses(coursesRes.data.data || []);

        const pendingRes = await axios.get(
          "http://localhost:3000/api/v1/admin/pending-courses",
          { headers, withCredentials: true }
        );
        setPendingCourses(pendingRes.data.data || []);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDashboardData();
  }, [token]);

  const handleApprove = async (courseId) => {
    try {
      await axios.put(
        `http://localhost:3000/api/v1/admin/approve-course/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setPendingCourses((prev) =>
        prev.filter((course) => course._id !== courseId)
      );
      setAllCourses((prev) =>
        prev.map((c) =>
          c._id === courseId ? { ...c, status: "approved" } : c
        )
      );
    } catch (error) {
      console.error("Failed to approve course:", error);
    }
  };

  const handleReject = async (courseId) => {
    try {
      await axios.put(
        `http://localhost:3000/api/v1/admin/reject-course/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setPendingCourses((prev) =>
        prev.filter((course) => course._id !== courseId)
      );
    } catch (error) {
      console.error("Failed to reject course:", error);
    }
  };

  const handleAddMentor = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/v1/admin/add-mentor",
        mentorForm,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      alert("Mentor added successfully!");
      setMentorForm({ name: "", email: "", password: "", expertise: "" });
      setShowAddMentor(false);
      const mentorsRes = await axios.get(
        "http://localhost:3000/api/v1/admin/all-mentors",
        { withCredentials: true }
      );
      setMentors(mentorsRes.data.data || []);
    } catch (error) {
      console.error("Failed to add mentor:", error);
      alert("Error adding mentor");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  const CourseGrid = ({ courses }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div
          key={course._id}
          className="bg-white shadow rounded-xl overflow-hidden"
        >
          <img
            src={
              course.thumbnail ||
              course.thumbnailUrl ||
              "/default-thumbnail.jpg"
            }
            alt={course.name}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h4 className="font-bold text-lg mb-1">{course.name}</h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {course.description}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Mentor: {course.mentor?.name || "N/A"}
            </p>
            <button className="flex mx-auto text-white bg-purple-600 hover:bg-purple-700 py-2 px-[130px] mt-2 rounded-lg "
            onClick={() => navigate(`/admin/course/${course._id}/lessons`)}
            >
              Detail
            </button>
            {activeTab === "pending" && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleApprove(course._id)}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(course._id)}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar (desktop + mobile overlay) */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-4 flex flex-col transform transition-transform duration-300 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
            Admin Panel
          </h2>
          <button
            className="md:hidden text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <ul className="space-y-3 flex-1">
          {[
            { key: "stats", label: "Dashboard", icon: Users },
            { key: "mentors", label: "Mentors", icon: GraduationCap },
            { key: "courses", label: "All Courses", icon: BookOpen },
            { key: "approved", label: "Approved Courses", icon: BookOpen },
            { key: "pending", label: "Pending", icon: Clock },
          ].map(({ key, label, icon: Icon }) => (
            <li key={key}>
              <button
                onClick={() => {
                  setActiveTab(key);
                  setShowAddMentor(false);
                  setSidebarOpen(false); // ✅ auto-close on mobile
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  activeTab === key
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Icon className="w-5 h-5" /> {label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => {
                setShowAddMentor(true);
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition bg-green-600 text-white hover:bg-green-700"
            >
              <PlusCircle className="w-5 h-5" /> Add Mentor
            </button>
          </li>
        </ul>

        <button
          onClick={logout}
          className="mt-6 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto md:ml-64">
        {/* Topbar for mobile */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Welcome, {admin?.name}</h2>
          <button
            className="text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Welcome for desktop */}
        <h2 className="hidden md:block text-2xl font-bold mb-6">
          Welcome, {admin?.name || "Admin"}
        </h2>

        {/* Stats */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Total Users", value: stats.totalUsers, icon: Users },
              {
                label: "Total Mentors",
                value: stats.totalMentors,
                icon: GraduationCap,
              },
              {
                label: "Total Courses",
                value: stats.totalCourses,
                icon: BookOpen,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="bg-white shadow rounded-xl p-6 flex items-center gap-4"
              >
                <Icon className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-gray-500">{label}</p>
                  <p className="text-2xl font-bold">{value || 0}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mentors */}
        {activeTab === "mentors" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">All Mentors</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <div
                  key={mentor._id}
                  className="bg-white shadow rounded-xl p-6"
                >
                  <h4 className="font-bold text-lg">{mentor.name}</h4>
                  <p className="text-gray-600">{mentor.email}</p>
                  <p className="text-sm text-gray-500">{mentor.expertise}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses */}
        {activeTab === "courses" && <CourseGrid courses={allCourses} />}
        {activeTab === "approved" && (
          <CourseGrid
            courses={allCourses.filter((c) => c.status === "approved")}
          />
        )}
        {activeTab === "pending" && <CourseGrid courses={pendingCourses} />}

        {/* Add Mentor Modal */}
        {showAddMentor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
              <button
                onClick={() => setShowAddMentor(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
                Add New Mentor
              </h2>
              <form onSubmit={handleAddMentor} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={mentorForm.name}
                  onChange={(e) =>
                    setMentorForm({ ...mentorForm, name: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={mentorForm.email}
                  onChange={(e) =>
                    setMentorForm({ ...mentorForm, email: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={mentorForm.password}
                  onChange={(e) =>
                    setMentorForm({ ...mentorForm, password: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Expertise"
                  value={mentorForm.expertise}
                  onChange={(e) =>
                    setMentorForm({ ...mentorForm, expertise: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMentor(false)}
                    className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
