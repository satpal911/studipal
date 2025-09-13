// src/pages/Courses.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useUser(); // from context
  const navigate = useNavigate();

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/courses");
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Enroll handler
  const handleEnroll = async (courseId) => {
    if (!user || !token) {
      navigate("/user/login"); // redirect to login if not logged in
      return;
    }

    try {
      await axios.post(
        `http://localhost:3000/api/v1/courses/enroll/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Successfully enrolled!");
    } catch (err) {
      console.error("Enroll failed:", err);
      alert("❌ Enrollment failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">Loading courses...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <h1 className="text-4xl font-bold text-indigo-600 mb-6 text-center">
        Explore Our Courses
      </h1>
      <p className="text-lg text-gray-700 text-center mb-12">
        Choose from a variety of courses designed to boost your skills and career.
      </p>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <p className="text-center text-gray-500">No courses available right now.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-indigo-700 mb-2">
                {course.title}
              </h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>📘 {course.level || "All Levels"}</span>
                <span>⏳ {course.duration || "Flexible"}</span>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => handleEnroll(course._id)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Enroll Now
                </button>
                <Link
                  to={`/courses/${course._id}`}
                  className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
