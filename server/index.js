const express = require("express")
const cookieParser = require("cookie-parser")
const courseRouter = require("./routes/course.router.js")
const userRouter = require("./routes/user.router.js")
const mentorRouter = require("./routes/mentor.router.js")
const adminRouter = require("./routes/admin.router.js")
const lessonRouter = require("./routes/lesson.router.js")
const connectDb = require("./database/db")
const enrollRouter = require("./routes/enroll.router.js")
require("dotenv").config();
const cors = require("cors")

const app = express()
const port = 3000

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

connectDb().then(()=>{
    app.use("/api/v1/course", courseRouter)
    app.use("/api/v1/user", userRouter)
    app.use("/api/v1/mentor", mentorRouter)
    app.use("/api/v1/admin", adminRouter)
    app.use("/api/v1/lesson", lessonRouter)
    app.use("/api/v1/user-enroll", enrollRouter)
    app.listen(port,()=>{
        console.log(`database running on port http://localhost:${port}`)
    })
})
.catch((error)=>{
        console.error("Database connection failed:", error);
})