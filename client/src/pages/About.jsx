import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function About() {
  const location = useLocation();

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-indigo-600 mb-6 text-center">
        About Studipal
      </h1>
      <p className="text-lg text-gray-700 text-center mb-12">
        Studipal is your ultimate Learning Management System designed to help
        learners, mentors, and administrators connect, grow, and achieve
        success.
      </p>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
            🎯 Our Mission
          </h2>
          <p className="text-gray-700">
            To empower learners worldwide by providing quality education,
            mentorship, and tools that make learning engaging, accessible, and
            effective.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
            🌍 Our Vision
          </h2>
          <p className="text-gray-700">
            To build a global community where students learn, mentors guide, and
            administrators ensure a smooth and secure education ecosystem.
          </p>
        </div>
      </div>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          What Makes Studipal Unique?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-indigo-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">
              📚 Interactive Learning
            </h3>
            <p className="text-gray-700">
              Courses designed with practical projects and real-world use cases
              so you can learn by doing.
            </p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">👩‍🏫 Expert Mentors</h3>
            <p className="text-gray-700">
              Get guidance from experienced mentors who provide personalized
              support and feedback.
            </p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">🛡️ Secure Platform</h3>
            <p className="text-gray-700">
              Advanced admin tools and data protection ensure a safe and
              reliable experience for all users.
            </p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Team</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-10">
          Behind Studipal is a passionate team of developers, educators, and
          innovators working together to transform education into a seamless and
          enjoyable journey.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Satpal", role: "Founder & Developer" },
            { name: "Mentor Team", role: "Guides & Educators" },
            { name: "Admin Team", role: "Support & Management" },
          ].map((member, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-indigo-700">
                {member.name}
              </h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
