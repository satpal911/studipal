const express = require("express")
const { registerAdmin, loginAdmin, approveCourse, rejectCourse, addMentor, getAdminStats, getAllMentors, getAllCourses, updateMentor, deleteMentor } = require("../controllers/admin.controller")
const adminAuthentication = require("../middleware/auth.admin")
const { getPendingCourses } = require("../controllers/course.controller")
const { getCourseLessons } = require("../controllers/lesson.controller")

const adminRouter = express.Router()

adminRouter.post("/register", registerAdmin)
adminRouter.post("/login", loginAdmin)

adminRouter.get("/me", adminAuthentication, (req, res) => {
  res.json(req.admin)   // 👈 send admin details (without password)
})

adminRouter.post("/add-mentor", addMentor)

adminRouter.put("/approve-course/:id", adminAuthentication, approveCourse);
adminRouter.put("/reject-course/:id", adminAuthentication, rejectCourse);

adminRouter.get("/stats", adminAuthentication, getAdminStats);
adminRouter.get("/pending-courses", adminAuthentication, getPendingCourses)

adminRouter.get("/all-mentors", adminAuthentication, getAllMentors);
adminRouter.get("/all-courses", adminAuthentication, getAllCourses);
adminRouter.get("/course/:courseId/lessons", adminAuthentication, getCourseLessons);

adminRouter.put("/update-mentor/:id", adminAuthentication,updateMentor)
adminRouter.delete("/delete-mentor/:id", adminAuthentication, deleteMentor)

module.exports = adminRouter