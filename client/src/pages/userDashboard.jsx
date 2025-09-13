// src/pages/UserDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { toast } from "react-hot-toast";

export default function UserDashboard() {
  const { user, token, logout } = useUser();
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewEnrolled, setViewEnrolled] = useState(false); // new state

  // Fetch all courses and enrolled courses
  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const [coursesRes, enrolledRes] = await Promise.all([
          axios.get("http://localhost:3000/api/v1/course/get-all-courses", {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/api/v1/user-enroll/get-enrolled", {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
        ]);

        setAllCourses(coursesRes.data.data || []);
        setEnrolledCourses(enrolledRes.data.enrolled || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  // Fetch lessons for a course
  const fetchLessons = async (courseId) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/lesson/get-all-lessons/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setLessons(res.data.data || []);
      setSelectedCourse(allCourses.find((c) => c._id === courseId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch lessons");
    }
  };

  // Enroll in a course
  const handleEnroll = async (courseId) => {
    try {
      await axios.post(
        `http://localhost:3000/api/v1/user-enroll/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      toast.success("Enrolled successfully!");
      const enrolledCourse = allCourses.find((c) => c._id === courseId);
      setEnrolledCourses((prev) => [...prev, enrolledCourse]);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Enrollment failed");
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;

  const coursesToDisplay = viewEnrolled ? enrolledCourses : allCourses;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">User Dashboard</h2>
        <p className="mb-4 text-gray-700">Welcome, {user?.name || "User"}!</p>

        {/* Buttons to switch between all/enrolled courses */}
        <button
          onClick={() => setViewEnrolled(false)}
          className={`mb-2 px-4 py-2 rounded-lg w-full text-white ${
            !viewEnrolled ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 hover:bg-gray-400"
          } transition`}
        >
          All Courses
        </button>
        <button
          onClick={() => setViewEnrolled(true)}
          className={`mb-2 px-4 py-2 rounded-lg w-full text-white ${
            viewEnrolled ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 hover:bg-gray-400"
          } transition`}
        >
          Enrolled Courses
        </button>

        <button
          onClick={logout}
          className="mt-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {!selectedCourse && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {viewEnrolled ? "Enrolled Courses" : "All Courses"}
            </h2>
            {coursesToDisplay.length === 0 && (
              <p className="text-gray-500">No courses to display.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesToDisplay.map((course) => {
                const enrolled = enrolledCourses.some((c) => c._id === course._id);
                return (
                  <div
                    key={course._id}
                    className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition"
                  >
                    <img
                      src={course.thumbnail || "/default-thumbnail.jpg"}
                      alt={course.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4 flex flex-col">
                      <h4 className="font-bold text-lg mb-1">{course.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Mentor: {course.mentor?.name || "N/A"}
                      </p>
                      {enrolled ? (
                        <button
                          onClick={() => fetchLessons(course._id)}
                          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          View Lessons
                        </button>
                      ) : !viewEnrolled ? (
                        <button
                          onClick={() => handleEnroll(course._id)}
                          className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          Enroll Now
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Lessons of selected course */}
        {selectedCourse && (
          <>
            <button
              onClick={() => {
                setSelectedCourse(null);
                setLessons([]);
              }}
              className="mb-4 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
            >
              ← Back to Courses
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {selectedCourse.name} - Lessons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className="bg-white shadow-lg rounded-xl p-4 hover:shadow-xl transition"
                >
                  <h4 className="font-bold text-lg mb-2">{lesson.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                  {lesson.videoUrl && (
                    <video controls className="w-full h-48 rounded-lg mt-2">
                      <source src={lesson.videoUrl} type="video/mp4" />
                    </video>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
