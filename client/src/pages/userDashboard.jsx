import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";
import { Menu, X } from "lucide-react";
import Banner from "./Banner";
import Lessons from "./Lessons";

export default function UserDashboard() {
  const { user, token, logout } = useUser();
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const videoRefs = useRef([]);
  const [viewEnrolled, setViewEnrolled] = useState(
    localStorage.getItem("viewEnrolled") === "true"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
  const restoreState = async () => {
    const savedCourse = localStorage.getItem("selectedCourse");
    const savedVideo = localStorage.getItem("currentVideo");

    if (savedCourse) {
      const course = JSON.parse(savedCourse);
      if (course && course._id) {
        // Try to restore lessons from localStorage
        const savedLessons = localStorage.getItem(`lessons_${course._id}`);
        if (savedLessons) {
          setLessons(JSON.parse(savedLessons));
        }
        setSelectedCourse(course);
      }
    }

    if (savedVideo) setCurrentVideo(JSON.parse(savedVideo));
  };

  restoreState();
}, []);


  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const [coursesRes, enrolledRes] = await Promise.all([
          axios.get("http://localhost:3000/api/v1/course/get-all-courses"),
          axios.get("http://localhost:3000/api/v1/user-enroll/get-enrolled", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const approvedCourses = (coursesRes.data.data || []).filter(
          (c) => c && c.status === "approved" && c._id
        );
        setAllCourses(approvedCourses);

        const enrolledFull = (enrolledRes.data.data || []).filter(
          (c) => c && c._id
        );
        setEnrolledCourses(enrolledFull);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [token]);

  // Fetch lessons for selected course
  const fetchLessons = async (courseId) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/lesson/get-all-lessons/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const lessonsData = res.data.data || [];
      setLessons(lessonsData);

      // Save lessons to localStorage
      localStorage.setItem(`lessons_${courseId}`, JSON.stringify(lessonsData));

      const course =
        allCourses.find((c) => c && c._id === courseId) ||
        enrolledCourses.find((c) => c && c._id === courseId);

      setSelectedCourse(course || null);
      localStorage.setItem("selectedCourse", JSON.stringify(course || null));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch lessons");
    }
  };

  // Enroll in course
  const handleEnroll = async (courseId) => {
    if (enrolledCourses.some((c) => c && c._id === courseId)) {
      toast.error("You are already enrolled in this course");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/user-enroll/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Enrolled successfully!");
        const enrolledCourse = allCourses.find((c) => c && c._id === courseId);
        if (enrolledCourse)
          setEnrolledCourses((prev) => [...prev, enrolledCourse]);
      } else toast.error(res.data.message || "Enrollment failed");
    } catch (err) {
      console.error("Enroll Error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Enrollment failed");
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;

  const coursesToDisplay = viewEnrolled ? enrolledCourses : allCourses;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-6 flex flex-col transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex justify-between items-center mb-8 md:hidden">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <h2 className="text-blue-600 hidden md:block text-3xl font-bold">
          Studipal
        </h2>
        <hr className="my-2" />

        <button
          onClick={() => {
            setViewEnrolled(false);
            localStorage.setItem("viewEnrolled", "false");
            setSidebarOpen(false);
          }}
          className={`mb-2 px-4 py-2 rounded-lg w-full ${
            !viewEnrolled
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-white-300 hover:bg-white-400 border"
          } transition`}
        >
          All Courses
        </button>
        <button
          onClick={() => {
            setViewEnrolled(true);
            localStorage.setItem("viewEnrolled", "true");
            setSidebarOpen(false);
          }}
          className={`mb-2 px-4 py-2 rounded-lg w-full ${
            viewEnrolled
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-white-300 border"
          } transition`}
        >
          Enrolled Courses
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("viewEnrolled");
            logout();
            toast.success("Logged out successfully!");
          }}
          className="mt-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-64 overflow-y-auto">
        <div className="md:hidden flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">Studipal</h2>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Courses List */}
        {!selectedCourse && (
          <>
            <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
              <span className="block text-xl sm:text-2xl text-green-600 mb-2">
                Welcome, {user?.name}
              </span>
              <hr />
              {viewEnrolled ? "Enrolled Courses" : "All Courses"}
            </h1>

            {coursesToDisplay.length === 0 && (
              <p className="text-gray-500 text-center">
                No courses to display.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {coursesToDisplay
                .filter((course) => course && course._id)
                .map((course) => {
                  const isEnrolled = enrolledCourses.some(
                    (c) => c && c._id === course._id
                  );
                  return (
                    <div
                      key={course._id}
                      className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:scale-105 transition-transform duration-300 overflow-hidden group"
                    >
                      <div className="relative">
                        <img
                          src={course.thumbnail || "/default-thumbnail.jpg"}
                          alt={course.name || "Course"}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                          {course.category || "General"}
                        </span>
                        <h2 className="absolute bottom-2 left-2 text-white font-semibold text-sm sm:text-base line-clamp-2">
                          {course.name || "Untitled Course"}
                        </h2>
                      </div>

                      <div className="p-4">
                        <p className="text-gray-600 text-sm mb-3 line-clamp-1">
                          {course.description || "No description available."}
                        </p>
                        <p className="text-sm text-gray-500 mb-3">
                          Mentor: {course.mentor?.name || "N/A"}
                        </p>
                        <div className="flex justify-center">
                          {isEnrolled ? (
                            <button
                              onClick={() => fetchLessons(course._id)}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-300 shadow hover:shadow-lg"
                            >
                              View Lessons
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEnroll(course._id)}
                              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-all duration-300 shadow hover:shadow-lg"
                            >
                              Enroll Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}

        {/* Selected Course */}
        {selectedCourse && (
          <>
            <button
              onClick={() => {
                setSelectedCourse(null);
                setLessons([]);
              }}
              className="mb-6 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
            >
              ← Back to Courses
            </button>

            <Banner course={selectedCourse} />
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {selectedCourse.name} - Lessons
            </h2>
            <Lessons
              lessons={lessons}
              currentVideo={currentVideo}
              setCurrentVideo={(video) => {
                setCurrentVideo(video);
                localStorage.setItem("currentVideo", JSON.stringify(video));
              }}
            />
          </>
        )}
      </main>
    </div>
  );
}
