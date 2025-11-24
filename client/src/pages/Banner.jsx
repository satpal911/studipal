export default function Banner({ course }) {
  if (!course) return null;

  return (
    <div className="bg-gray-800 text-white rounded-xl overflow-hidden mb-6 relative">
      <img
        src={
          course.thumbnail
            ? course.thumbnail
            : "https://via.placeholder.com/600x200"
        }
        alt={course.name}
        className="w-full h-60 object-cover opacity-80"
      />
      <div className="absolute bottom-4 left-6">
        <h1 className="text-3xl font-bold">{course.name}</h1>
        <p className="text-gray-200 mt-1">
          {course.description || "No description available."}
        </p>
      </div>
    </div>
  );
}
