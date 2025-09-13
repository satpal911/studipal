// src/pages/MentorDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useMentor } from "../context/MentorContext";
import { Users, BookOpen, Clock, LogOut, LayoutDashboard, X, PlusCircle } from "lucide-react";

export default function MentorDashboard() {
  const { mentor, token, logout } = useMentor();
  const [stats, setStats] = useState({});
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stats");
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({
    name: "",
    description: "",
    thumbnail: "",
  });

  useEffect(() => {
    const fetchMentorData = async () => {
      if (!token) return;
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // ✅ Get mentor details
        const mentorRes = await axios.get("http://localhost:3000/api/v1/mentor/me", {
          headers,
          withCredentials: true,
        });
        // stats example, you can calculate from courses or backend
        const coursesRes = await axios.get(
          "http://localhost:3000/api/v1/course/mentor/get-all-courses",
          { headers, withCredentials: true }
        );
        setCourses(coursesRes.data.data || []);

        // Calculate stats from courses
        const totalCourses = coursesRes.data.data.length;
        const pendingCourses = coursesRes.data.data.filter(c => c.status === "pending").length;
        setStats({ totalCourses, pendingCourses });
      } catch (error) {
        console.error("Failed to load mentor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, [token]);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/v1/course/add-course",
        courseForm,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      alert("Course added successfully!");
      setCourseForm({ name: "", description: "", thumbnail: "" });
      setShowAddCourse(false);

      // Refresh courses
      const res = await axios.get("http://localhost:3000/api/v1/course/mentor/get-all-courses", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setCourses(res.data.data || []);

      // Update stats
      const totalCourses = res.data.data.length;
      const pendingCourses = res.data.data.filter(c => c.status === "pending").length;
      setStats({ totalCourses, pendingCourses });
    } catch (error) {
      console.error("Failed to add course:", error);
      alert("Error adding course");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  const CourseGrid = ({ courses }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div key={course._id} className="bg-white shadow rounded-xl overflow-hidden">
          <img
            src={course.thumbnail || "/default-thumbnail.jpg"}
            alt={course.name}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h4 className="font-bold text-lg mb-1">{course.name}</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Status: {course.status || "pending"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-blue-600" />
          Mentor Panel
        </h2>
        <ul className="space-y-3 flex-1">
          {[{ key: "stats", label: "Dashboard", icon: Users }, { key: "courses", label: "My Courses", icon: BookOpen }].map(
            ({ key, label, icon: Icon }) => (
              <li key={key}>
                <button
                  onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    activeTab === key ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5" /> {label}
                </button>
              </li>
            )
          )}
          {/* Add Course */}
          <li>
            <button
              onClick={() => setShowAddCourse(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition bg-green-600 text-white hover:bg-green-700"
            >
              <PlusCircle className="w-5 h-5" /> Add Course
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
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Welcome, {mentor?.name || "Mentor"}</h2>

        {/* Stats */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ label: "My Courses", value: stats.totalCourses, icon: BookOpen }, { label: "Pending Approvals", value: stats.pendingCourses, icon: Clock }].map(
              ({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white shadow rounded-xl p-6 flex items-center gap-4">
                  <Icon className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-gray-500">{label}</p>
                    <p className="text-2xl font-bold">{value || 0}</p>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Courses */}
        {activeTab === "courses" && <CourseGrid courses={courses} />}

        {/* Add Course Modal */}
        {showAddCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
              <button
                onClick={() => setShowAddCourse(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Add New Course</h2>
              <form onSubmit={handleAddCourse} className="space-y-4">
                <input
                  type="text"
                  placeholder="Course Name"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Thumbnail URL"
                  value={courseForm.thumbnail}
                  onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <div className="flex gap-3 mt-4">
                  <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Save</button>
                  <button type="button" onClick={() => setShowAddCourse(false)} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
