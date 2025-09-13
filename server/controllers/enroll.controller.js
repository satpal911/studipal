const User = require("../models/user.model");
const Course = require("../models/course.model");

// ✅ Enroll a student into a course
const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;   // courseId from URL
    const userId = req.user.id;        // logged-in student (from auth middleware)

    // 1. Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // 2. Allow enrollment only if course is approved
    if (course.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "This course is not approved yet. Enrollment not allowed."
      });
    }

    // 3. Find the student
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 4. Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.some(
      (enrolled) => enrolled.courseId.toString() === courseId.toString()
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled for this course",
      });
    }

    // 5. Add enrollment
    user.enrolledCourses.push({
      courseId,
      status: "pending",   // default enrollment status
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

// ✅ Get only approved enrolled courses (with mentor details)
const getEnrolled = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
      path: "enrolledCourses.courseId",
      model: "Course",
      match: { status: "approved" }, // fetch only approved courses
      populate: {
        path: "mentor",
        model: "Mentor",
        select: "name email"
      }
    });

    const approvedCourses = user.enrolledCourses.filter(c => c.courseId !== null);

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

// ✅ Get pending enrolled courses (student can see what’s waiting for approval)
const getPendingEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
      path: "enrolledCourses.courseId",
      model: "Course",
      match: { status: "pending" },
      populate: {
        path: "mentor",
        model: "Mentor",
        select: "name email"
      }
    });

    const pendingCourses = user.enrolledCourses.filter(c => c.courseId !== null);

    res.status(200).json({
      success: true,
      message: "Pending enrolled courses fetched successfully",
      data: pendingCourses
    });
  } catch (error) {
    console.error("getPendingEnrollments error:", error);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`
    });
  }
};

module.exports = { enrollCourse, getEnrolled, getPendingEnrollments };
