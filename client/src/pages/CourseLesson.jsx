import Lessons from "./Lessons";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMentor } from "../context/MentorContext";
import { X, Edit, Trash2 } from "lucide-react"; // ✅ added icons

export default function CourseLessons() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { mentor, token } = useMentor();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    content: "",
    video: null,
    thumbnail: null,
  });

  // ✅ added for edit functionality
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Helper to get full image URL or fallback
  const getFullImageUrl = (path, fallback) => {
    if (!path || path.trim() === "") return fallback; // fallback if empty
    if (path.startsWith("http") || path.startsWith("https")) return path;
    return `http://localhost:3000/${path}`;
  };

  // Fetch course and lessons
  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || !token) return;
      setLoading(true);
      setError("");
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [courseRes, lessonsRes] = await Promise.all([
          axios.get(
            `http://localhost:3000/api/v1/course/get-one-course/${courseId}`,
            { headers, withCredentials: true }
          ),
          axios.get(
            `http://localhost:3000/api/v1/lesson/mentor/get-all-lessons/${courseId}`,
            { headers, withCredentials: true }
          ),
        ]);

        const courseData = courseRes.data.data;
        setCourse(courseData || null);

        const sortedLessons = (lessonsRes.data.data || []).sort(
          (a, b) => a.order - b.order
        );
        setLessons(sortedLessons);

        if (sortedLessons.length > 0) setCurrentVideo(sortedLessons[0]);
      } catch (err) {
        console.error("Error fetching course or lessons:", err);
        setError(
          err.response?.data?.message || "Failed to load course or lessons."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, token]);

  // ✅ unified Add / Edit handler
  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.title || !lessonForm.content)
      return alert("Please fill all fields");

    try {
      const formData = new FormData();
      formData.append("title", lessonForm.title);
      formData.append("content", lessonForm.content);
      if (lessonForm.video) formData.append("videoUrl", lessonForm.video);
      if (lessonForm.thumbnail)
        formData.append("thumbnail", lessonForm.thumbnail);

      if (isEditing && selectedLesson) {
        // ✏️ update existing lesson
        await axios.put(
          `http://localhost:3000/api/v1/lesson/update-lesson/${selectedLesson._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // ➕ add new lesson
        await axios.post(
          `http://localhost:3000/api/v1/lesson/add-lesson/${courseId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      // Refresh lessons
      const lessonsRes = await axios.get(
        `http://localhost:3000/api/v1/lesson/mentor/get-all-lessons/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const sortedLessons = (lessonsRes.data.data || []).sort(
        (a, b) => a.order - b.order
      );
      setLessons(sortedLessons);
      setLessonForm({ title: "", content: "", video: null, thumbnail: null });
      setSelectedLesson(null);
      setIsEditing(false);
      setShowAddLesson(false);
      if (!currentVideo && sortedLessons.length > 0)
        setCurrentVideo(sortedLessons[0]);
    } catch (err) {
      console.error("Failed to save lesson:", err);
      alert(err.response?.data?.message || "Error saving lesson");
    }
  };

  // ✏️ Edit Lesson (✅ added)
  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setLessonForm({
      title: lesson.title,
      content: lesson.content,
      video: null,
      thumbnail: null,
    });
    setIsEditing(true);
    setShowAddLesson(true);
  };

  // 🗑 Delete Lesson (✅ added)
  const handleDeleteLesson = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/v1/lesson/delete-lesson/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh lessons
      const lessonsRes = await axios.get(
        `http://localhost:3000/api/v1/lesson/mentor/get-all-lessons/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const sortedLessons = (lessonsRes.data.data || []).sort(
        (a, b) => a.order - b.order
      );
      setLessons(sortedLessons);
    } catch (error) {
      console.error(error);
      alert("Failed to delete lesson");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        &larr; Back
      </button>

      {/* Course Banner */}
      {course && (
        <div className="bg-gray-800 text-white rounded-xl overflow-hidden mb-6 relative">
          <img
            src={getFullImageUrl(
              course.thumbnail,
              "https://via.placeholder.com/600x200"
            )}
            alt={course.name}
            className="w-full h-60 object-cover opacity-80"
          />
          <div className="absolute bottom-4 left-6">
            <h1 className="text-3xl font-bold">{course.name}</h1>
            <p className="text-gray-200 mt-1">{course.description}</p>
          </div>
        </div>
      )}

      <Lessons
        lessons={lessons}
        currentVideo={currentVideo}
        setCurrentVideo={setCurrentVideo}
        canEdit={true}
        onEdit={handleEditLesson}
        onDelete={handleDeleteLesson}
      />

      {/* Add / Edit Lesson Modal */}
      {mentor && showAddLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => {
                setShowAddLesson(false);
                setIsEditing(false);
                setSelectedLesson(null);
                setLessonForm({
                  title: "",
                  content: "",
                  video: null,
                  thumbnail: null,
                });
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
              {isEditing ? "Edit Lesson" : "Add New Lesson"}
            </h2>
            <form onSubmit={handleAddLesson} className="space-y-4">
              <input
                type="text"
                placeholder="Lesson Title"
                value={lessonForm.title}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, title: e.target.value })
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
              <textarea
                placeholder="Content / Description"
                value={lessonForm.content}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, content: e.target.value })
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, video: e.target.files[0] })
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
              {/* <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, thumbnail: e.target.files[0] })
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              /> */}
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  {isEditing ? "Update Lesson" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddLesson(false);
                    setIsEditing(false);
                    setSelectedLesson(null);
                  }}
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
  );
}
