const express = require("express")
const { loginMentor } = require("../controllers/mentor.controller")
const mentorAuthentication = require("../middleware/auth.mentor")
const Course = require("../models/course.model")

const mentorRouter = express.Router()

// mentorRouter.post("/register", registerMentor)
mentorRouter.post("/login", loginMentor)

mentorRouter.get("/me", mentorAuthentication, (req, res) => {
  res.json(req.mentor)   //send mentor details (without password)
})

mentorRouter.get("/stats", mentorAuthentication, async (req, res) => {
  try {
    const mentorId = req.mentor._id;

    const totalCourses = await Course.countDocuments({ mentor: mentorId });
    const approvedCourses = await Course.countDocuments({
      mentor: mentorId,
      status: "approved",
    });
    const pendingCourses = await Course.countDocuments({
      mentor: mentorId,
      status: "pending",
    });
    const rejectedCourses = await Course.countDocuments({
      mentor: mentorId,
      status: "rejected",
    });

    res.json({
      success: true,
      data: {
        totalCourses,
        approvedCourses,
        pendingCourses,
        rejectedCourses,
      },
    });
  } catch (error) {
    console.error("Error fetching mentor stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = mentorRouter
