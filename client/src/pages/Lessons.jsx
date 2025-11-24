import React from "react";
import { Edit, Trash2 } from "lucide-react";

export default function Lessons({
  lessons,
  currentVideo,
  setCurrentVideo,
  canEdit = false, // 🔹 false for students, true for mentors
  onEdit,
  onDelete,
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* 🔹 Lessons List Section */}
      <div className="lg:w-1/3 space-y-4 overflow-y-auto max-h-[70vh]">
        {lessons.length === 0 && (
          <p className="text-gray-500 text-center">No lessons available.</p>
        )}

        {lessons.map((lesson, index) => (
          <div
            key={lesson._id}
            className={`bg-white shadow rounded-xl overflow-hidden cursor-pointer ${
              currentVideo?._id === lesson._id ? "border-2 border-blue-600" : ""
            }`}
            onClick={() => setCurrentVideo(lesson)}
          >
            {/* Lesson Thumbnail */}
            <img
              src={lesson.thumbnail || "/default-video-thumbnail.jpg"}
              alt={lesson.title}
              className="w-full h-28 object-cover"
            />

            {/* Lesson Info */}
            <div className="p-3">
              <h3 className="font-bold text-lg">
                {index + 1}. {lesson.title}
              </h3>
              <p className="text-gray-500 text-sm line-clamp-2">
                {lesson.content}
              </p>

              {/* 🔹 Show Edit/Delete Buttons only if canEdit is true */}
              {canEdit && (
                <div className="flex justify-end gap-3 mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(lesson);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(lesson._id);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Video Player Section */}
      <div className="rounded-xl text-xl text-gray-400 overflow-hidden flex-1">
        {currentVideo ? (
          <video
            key={currentVideo._id}
            src={currentVideo.videoUrl}
            controls
            autoPlay
            className="w-full h-80 lg:h-[500px] object-cover rounded-xl shadow"
          />
        ) : (
          <p className="text-center p-6">Select a lesson to start playing.</p>
        )}
      </div>
    </div>
  );
}
