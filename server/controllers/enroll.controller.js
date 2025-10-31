const User = require("../models/user.model");
const Course = require("../models/course.model");

// Enroll a student into a course
const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "This course is not approved yet. Enrollment not allowed."
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const alreadyEnrolled = user.enrolledCourses.some(
      (enrolled) => enrolled.courseId.toString() === courseId.toString()
    );
    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled for this course",
      });
    }

    user.enrolledCourses.push({
      courseId,
      status: "pending",
      progress: 0,
      enrolledAt: new Date(),
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Enrolled successfully",
      enrolledCourses: user.enrolledCourses,
    });
  } catch (err) {
    console.error("Enroll error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//Get enrolled courses
const getEnrolled = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
      path: "enrolledCourses.courseId",
      model: "Course",
      match: { status: "approved" },
      populate: {
        path: "mentor",
        model: "Mentor",
        select: "name email"
      }
    });

    const approvedCourses = user.enrolledCourses
      .filter(c => c.courseId !== null)
      .map(c => c.courseId);

    res.status(200).json({
      success: true,
      message: "Enrolled approved courses fetched successfully",
      data: approvedCourses
    });
  } catch (error) {
    console.error("getEnrolled error:", error);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`
    });
  }
};

module.exports = { enrollCourse, getEnrolled };
