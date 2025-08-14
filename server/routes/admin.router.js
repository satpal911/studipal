const express = require("express")
const { registerAdmin, loginAdmin, approveCourse, rejectCourse } = require("../controllers/admin.controller")
const adminAuthentication = require("../middleware/auth.admin")
const { getPendingCourses } = require("../controllers/course.controller")

const adminRouter = express.Router()

adminRouter.post("/register", registerAdmin)
adminRouter.post("/login", loginAdmin)

adminRouter.put("/approve-course/:id", adminAuthentication, approveCourse);
adminRouter.put("/reject-course/:id", adminAuthentication, rejectCourse);
adminRouter.get("/pending-courses", adminAuthentication, getPendingCourses)


module.exports = adminRouter