// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="bg-gray-50">
      <section className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Studipal 🎓
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Learn, mentor, and grow with the ultimate Learning Management
            System.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/courses"
              className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
            >
              Explore Courses
            </Link>
            <Link
              to="/user/register"
              className="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow hover:bg-yellow-500 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">Why Choose Studipal?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">📚 Learn Anytime</h3>
            <p className="text-gray-600">
              Access a variety of courses across technology, design, and more —
              at your own pace.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">👩‍🏫 Mentor Support</h3>
            <p className="text-gray-600">
              Get guidance from experienced mentors to stay on the right track.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">🛡️ Admin Control</h3>
            <p className="text-gray-600">
              A secure platform with powerful admin tools to manage learners and
              mentors.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">
            Popular Courses
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Full Stack Web Development",
                desc: "Master the MERN stack with hands-on projects.",
              },
              {
                title: "Data Science & ML",
                desc: "Learn Python, Pandas, and Machine Learning.",
              },
              {
                title: "UI/UX Design",
                desc: "Design stunning user experiences with Figma.",
              },
            ].map((course, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.desc}</p>
                <Link
                  to="/courses"
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-indigo-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to start your learning journey?
        </h2>
        <p className="mb-6">
          Join thousands of learners already building their future with Studipal.
        </p>
        <Link
          to="/user/register"
          className="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow hover:bg-yellow-500 transition"
        >
          Sign Up Now
        </Link>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-6 text-center">
        <p>© {new Date().getFullYear()} Studipal. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link to="/about" className="hover:text-white">
            About
          </Link>
          <Link to="/contact" className="hover:text-white">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
}
