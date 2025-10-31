import { useEffect, useState } from "react";
import axios from "axios";
import { useAdmin } from "../context/AdminContext";
import toast from "react-hot-toast"
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
import {
  Pie,
  Cell,
  PieChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const { admin, token, logout } = useAdmin();
  const [stats, setStats] = useState({});
  const [mentors, setMentors] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stats");
  const [showAddMentor, setShowAddMentor] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mentorForm, setMentorForm] = useState({
    name: "",
    email: "",
    password: "",
    expertise: "",
  });

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [showLessons, setShowLessons] = useState(false);

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
        prev.map((c) => (c._id === courseId ? { ...c, status: "approved" } : c))
      );
      toast.success("course approved successfully")
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
      toast.error("Course Rejected")
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
      toast.success("Mentor added successfully!");
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
            <button
              className="flex mx-auto text-white bg-purple-600 hover:bg-purple-700 py-2 px-[130px] mt-2 rounded-lg"
              onClick={() => handleViewLessons(course._id)}
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

  const handleViewLessons = async (courseId) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(
        `http://localhost:3000/api/v1/admin/course/${courseId}/lessons`,
        { headers, withCredentials: true }
      );
      setLessons(res.data.data || []);
      const course = allCourses.find((c) => c._id === courseId);
      setSelectedCourse(course);
      setShowLessons(true);
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
    }
  };

  //chart section
  <div className="bg-white p-6 rounded-2xl shadow-md mt-8">
    <h3 className="text-xl font-semibold mb-4 text-center text-blue-600">
      Platform Overview
    </h3>

    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[
              { name: "Users", value: stats.totalUsers || 0 },
              { name: "Mentors", value: stats.totalMentors || 0 },
              { name: "Courses", value: stats.totalCourses || 0 },
            ]}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={5}
            dataKey="value"
          >
            {["#3B82F6", "#10B981", "#F59E0B"].map((color, index) => (
              <Cell key={`cell-${index}`} fill={color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value}`, `${name}`]}
            contentStyle={{ borderRadius: "10px", fontSize: "14px" }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>;

  const StatsPieChart = ({ stats }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md mt-8">
      <h3 className="text-xl font-semibold mb-4 text-center text-blue-600">
        Platform Overview
      </h3>

      <div className="w-full h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={[
                { name: "Users", value: stats.totalUsers || 0 },
                { name: "Mentors", value: stats.totalMentors || 0 },
                { name: "Courses", value: stats.totalCourses || 0 },
              ]}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={5}
              dataKey="value"
            >
              {["#3B82F6", "#10B981", "#F59E0B"].map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value}`, `${name}`]}
              contentStyle={{ borderRadius: "10px", fontSize: "14px" }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar (desktop + mobile overlay) */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-4 flex flex-col transform transition-transform duration-300 z-40
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
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
                  setSidebarOpen(false);
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
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Total Users", value: stats.totalUsers },
                { label: "Total Mentors", value: stats.totalMentors },
                { label: "Total Courses", value: stats.totalCourses },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white shadow rounded-xl p-6 text-center"
                >
                  <p className="text-gray-500">{item.label}</p>
                  <p className="text-2xl font-bold">{item.value || 0}</p>
                </div>
              ))}
            </div>

            <StatsPieChart stats={stats} />
          </div>
        )}

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
        {showLessons && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-6 relative max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setShowLessons(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>

              <h3 className="text-2xl font-bold mb-4 text-blue-700">
                Lessons for: {selectedCourse?.name}
              </h3>

              {lessons.length === 0 ? (
                <p className="text-gray-500">
                  No lessons found for this course.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson._id}
                      className="bg-gray-50 border p-4 rounded-xl shadow-sm"
                    >
                      <h4 className="font-semibold text-lg mb-2">
                        {lesson.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {lesson.description}
                      </p>
                      {lesson.videoUrl && (
                        <video controls className="w-full rounded-lg">
                          <source src={lesson.videoUrl} type="video/mp4" />
                        </video>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
