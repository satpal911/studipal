// src/pages/Courses.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useUser();
  const navigate = useNavigate();

  // Fetch all approved courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          "https://studipal-1.onrender.com/api/v1/course/get-all-courses"
        );
        setCourses(res.data.data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    if (!user) {
      navigate("/user/login");
      return;
    }

    try {
      await axios.post(
        `https://studipal-1.onrender.com/api/v1/courses/enroll/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(" Successfully enrolled!");
    } catch (err) {
      console.error("Enroll failed:", err);
      alert(" Enrollment failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-indigo-600 mb-6 text-center">
        Explore Our Courses
      </h1>
      <p className="text-lg text-gray-700 text-center mb-12">
        Upskill yourself with our professionally curated courses.
      </p>

      {courses.length === 0 ? (
        <p className="text-center text-gray-500">
          No courses available right now.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:scale-105 transition-transform duration-300 overflow-hidden group"
            >
              {/* Thumbnail with gradient overlay */}
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                  {course.category}
                </span>
                <h2 className="absolute bottom-2 left-2 text-white font-semibold text-sm sm:text-base line-clamp-2">
                  {course.name}
                </h2>
              </div>

              {/* Course Info */}
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                {/* Enroll/Login button */}
                <div className="flex justify-center">
                  {user ? (
                    <button
                      onClick={() => handleEnroll(course._id)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-all duration-300 shadow hover:shadow-lg"
                    >
                      Enroll Now
                    </button>
                  ) : (
                    <Link
                      to="/user/login"
                      className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-all duration-300 shadow hover:shadow-lg"
                    >
                      Login to Enroll
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
