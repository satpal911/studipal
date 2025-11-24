import { useEffect, useState } from "react";
import axios from "axios";
import { useMentor } from "../context/MentorContext";
import toast from "react-hot-toast";
import {
  Users,
  BookOpen,
  PlusCircle,
  LogOut,
  LayoutDashboard,
  Clock,
  CheckCircle,
  Menu,
  X,
  LucideCross,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Pie,
  Cell,
  PieChart,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useNavigate } from "react-router-dom";

export default function MentorDashboard() {
  const { mentor, token, logout } = useMentor();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "stats"
  );

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({
    name: "",
    description: "",
    category: "",
    thumbnail: null,
  });

  const [lessonForm, setLessonForm] = useState({
    title: "",
    content: "",
    video: null,
    order: 1,
  });

  const [addingCourse, setAddingCourse] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);

  // Fetch courses and stats
  const fetchCourses = async () => {
    if (!token) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(
        "http://localhost:3000/api/v1/course/mentor/get-all-courses",
        { headers, withCredentials: true }
      );
      const allCourses = res.data.data || [];
      setCourses(allCourses);

      const totalCourses = allCourses.length;
      const pendingCourses = allCourses.filter(
        (c) => c.status === "pending"
      ).length;
      const approvedCourses = allCourses.filter(
        (c) => c.status === "approved"
      ).length;
      const rejectedCourses = allCourses.filter(
        (c) => c.status === "rejected"
      ).length;
      setStats({
        totalCourses,
        pendingCourses,
        approvedCourses,
        rejectedCourses,
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [token]);

  //ADD COURSE
  const handleAddCourse = async (e) => {
    e.preventDefault();
    setAddingCourse(true);
    try {
      const formData = new FormData();
      formData.append("name", courseForm.name);
      formData.append("description", courseForm.description);
      formData.append("category", courseForm.category);
      if (courseForm.thumbnail)
        formData.append("thumbnail", courseForm.thumbnail);

      if (selectedCourse) {
        // 🟢 Update existing course
        await axios.put(
          `http://localhost:3000/api/v1/course/update-course/${selectedCourse._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Course updated successfully!");
      } else {
        // 🟢 Add new course
        await axios.post(
          "http://localhost:3000/api/v1/course/add-course",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        toast.success("Course added successfully!");
      }

      setCourseForm({
        name: "",
        description: "",
        category: "",
        thumbnail: null,
      });
      setShowAddCourse(false);
      setSelectedCourse(null);
      fetchCourses();
    } catch (error) {
      console.error("Failed to save course:", error);
      alert(error.response?.data?.message || "Error saving course");
    } finally {
      setAddingCourse(false);
    }
  };

  // ✏️ Edit Course
  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setCourseForm({
      name: course.name,
      description: course.description,
      category: course.category,
      thumbnail: null,
    });
    setShowAddCourse(true);
  };

  // 🗑️ Delete Course
  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(
        `http://localhost:3000/api/v1/course/delete-course/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Course deleted successfully!");
      fetchCourses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete course");
    }
  };

  //ADD LESSON
  const handleAddLesson = async (e) => {
    e.preventDefault();
    setAddingLesson(true);
    if (!lessonForm.video) return alert("Please select a video file.");

    try {
      const formData = new FormData();
      formData.append("title", lessonForm.title);
      formData.append("content", lessonForm.content);
      formData.append("order", lessonForm.order || 1);
      formData.append("videoUrl", lessonForm.video);

      await axios.post(
        `http://localhost:3000/api/v1/lesson/add-lesson/${selectedCourse._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Lesson added successfully!");
      setLessonForm({ title: "", content: "", video: null, order: 1 });
      setShowAddLesson(false);
      fetchCourses();
    } catch (error) {
      console.error("Lesson error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error adding lesson");
    } finally {
      setAddingLesson(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  //COURSE GRID
  const CourseGrid = ({ courses }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div
          key={course._id}
          className="bg-white shadow rounded-xl overflow-hidden p-4"
        >
          <img
            src={course.thumbnail || "/default-thumbnail.jpg"}
            alt={course.name}
            className="w-full h-40 object-cover rounded-lg"
          />
          <h4 className="font-bold text-lg mt-2">{course.name}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">
            {course.description}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Status: {course.status || "pending"}
          </p>

          <div className="flex justify-end gap-3 mt-3">
            <button
              onClick={() => handleEditCourse(course)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit"
            >
              <Edit className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleDeleteCourse(course._id)}
              className="text-red-600 hover:text-red-800"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedCourse(course);
              setShowAddLesson(true);
            }}
            className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <PlusCircle className="w-5 h-5" /> Add Lesson
          </button>

          <button
            onClick={() => navigate(`/course/${course._id}/lessons`)}
            className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View Lessons
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-4 flex flex-col transform transition-transform duration-300 z-40
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-blue-600" /> Mentor Panel
          </h2>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <ul className="space-y-3 flex-1">
          {[
            { key: "stats", label: "Dashboard", icon: Users },
            { key: "courses", label: "My Courses", icon: BookOpen },
            { key: "pending", label: "Pending Courses", icon: Clock },
            { key: "approved", label: "Approved Courses", icon: CheckCircle },
          ].map(({ key, label, icon: Icon }) => (
            <li key={key}>
              <button
                onClick={() => {
                  setActiveTab(key);
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
                setShowAddCourse(true);
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition bg-green-600 text-white hover:bg-green-700"
            >
              <PlusCircle className="w-5 h-5" /> Add Course
            </button>
          </li>
        </ul>

        <button
          onClick={() => {
            localStorage.removeItem("activeTab");
            logout();
            toast.success("Logged out successfully!");
          }}
          className="mt-6 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

      <div className="flex-1 p-6 md:ml-64">
        <div className="md:hidden flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-green-700">
            Welcome, {mentor?.name}
          </h2>
          <button
            className="text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <h2 className="hidden md:block text-2xl font-bold mb-6 text-green-700">
          Welcome, {mentor?.name || "Mentor"}
        </h2>

        {activeTab === "stats" && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="flex justify-center items-center gap-4 bg-white shadow rounded-lg p-5 text-center">
                <div>
                  <BookOpen className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-gray-600">Total Courses</p>
                  <p className="font-bold text-3xl text-indigo-600">
                    {stats.totalCourses}
                  </p>
                </div>
              </div>
              <div className="flex justify-center items-center gap-4 bg-white shadow rounded-lg p-5 text-center">
                <div>
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-gray-600">Approved</p>
                  <p className="font-bold text-3xl text-green-600">
                    {stats.approvedCourses}
                  </p>
                </div>
              </div>
              <div className="flex justify-center items-center gap-4 bg-white shadow rounded-lg p-5 text-center">
                <div>
                  <Clock className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-gray-600">Pending</p>
                  <p className="font-bold text-3xl text-yellow-500">
                    {stats.pendingCourses}
                  </p>
                </div>
              </div>
              <div className="flex justify-center items-center gap-4 bg-white shadow rounded-lg p-5 text-center">
                <div>
                  <LucideCross className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-gray-600">Rejected</p>
                  <p className="font-bold text-3xl text-red-500">
                    {stats.rejectedCourses}
                  </p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
                Course Status Overview
              </h3>
              <div className="w-full h-96">
                <ResponsiveContainer width="100%" aspect={1}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Approved", value: stats.approvedCourses || 0 },
                        { name: "Pending", value: stats.pendingCourses || 0 },
                        { name: "Rejected", value: stats.rejectedCourses || 0 },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={130}
                      paddingAngle={4}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      <Cell fill="#22c55e" /> {/* Approved - green */}
                      <Cell fill="#eab308" /> {/* Pending - yellow */}
                      <Cell fill="#ef4444" /> {/* Rejected - red */}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div>
            <h3 className="text-xl font-bold mb-4">My Courses</h3>
            {courses.length > 0 ? (
              <CourseGrid courses={courses} />
            ) : (
              <div className="flex flex-col text-gray-400 text-center text-xl mt-6 items-center">
                <BookOpen className="w-10 h-10" />
                <p>No courses available. Click “Add Course” to create one!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "pending" && (
          <div>
            <h3 className="text-xl font-bold mb-4">Pending Courses</h3>
            {courses.filter((c) => c.status === "pending").length > 0 ? (
              <CourseGrid
                courses={courses.filter((c) => c.status === "pending")}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 mt-10">
                <Clock className="w-10 h-10 mb-2 text-gray-400" />
                <p>No pending courses found.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "approved" && (
          <div>
            <h3 className="text-xl font-bold mb-4">Approved Courses</h3>
            {courses.filter((c) => c.status === "approved").length > 0 ? (
              <CourseGrid
                courses={courses.filter((c) => c.status === "approved")}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 mt-10">
                <CheckCircle className="w-10 h-10 mb-2 text-gray-400" />
                <p>No approved courses found.</p>
              </div>
            )}
          </div>
        )}

        {/* Add Course Modal */}
        {showAddCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <form
              onSubmit={handleAddCourse}
              className="bg-white p-6 rounded-xl w-full max-w-md flex flex-col gap-3"
            >
              <h3 className="text-lg font-bold">
                {selectedCourse ? "Edit Course" : "Add Course"}
              </h3>

              <input
                type="text"
                placeholder="Name"
                value={courseForm.name}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, name: e.target.value })
                }
                required
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Category"
                value={courseForm.category}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, category: e.target.value })
                }
                required
                className="border p-2 rounded"
              />
              <textarea
                placeholder="Description"
                value={courseForm.description}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, description: e.target.value })
                }
                required
                className="border p-2 rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setCourseForm({ ...courseForm, thumbnail: e.target.files[0] })
                }
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourse(false)}
                  className="px-4 py-2 bg-gray-400 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingCourse}
                  className={`px-4 py-2 rounded-lg text-white flex items-center justify-center gap-2 ${
                    addingCourse
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {addingCourse ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : selectedCourse ? (
                    "Update"
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Lesson Modal */}
        {showAddLesson && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <form
              onSubmit={handleAddLesson}
              className="bg-white p-6 rounded-xl w-full max-w-md flex flex-col gap-3"
            >
              <h3 className="text-lg font-bold">
                Add Lesson to {selectedCourse.name}
              </h3>
              <input
                type="text"
                placeholder="Lesson Title"
                value={lessonForm.title}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, title: e.target.value })
                }
                required
                className="border p-2 rounded"
              />
              <textarea
                placeholder="Content"
                value={lessonForm.content}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, content: e.target.value })
                }
                required
                className="border p-2 rounded"
              />
              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, video: e.target.files[0] })
                }
                required
                className="border p-2 rounded"
              />

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLesson(false)}
                  className="px-4 py-2 bg-gray-400 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingLesson}
                  className={`px-4 py-2 rounded-lg text-white flex items-center justify-center gap-2 ${
                    addingLesson
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {addingLesson ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
