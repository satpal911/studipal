const express = require("express");
const cookieParser = require("cookie-parser");
const courseRouter = require("./routes/course.router.js");
const userRouter = require("./routes/user.router.js");
const mentorRouter = require("./routes/mentor.router.js");
const adminRouter = require("./routes/admin.router.js");
const lessonRouter = require("./routes/lesson.router.js");
const connectDb = require("./database/db");
const enrollRouter = require("./routes/enroll.router.js");
const contactRouter = require("./routes/contact.router.js");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://studipal-2.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDb()
  .then(() => {
    app.use("/api/v1/course", courseRouter);
    app.use("/api/v1/user", userRouter);
    app.use("/api/v1/mentor", mentorRouter);
    app.use("/api/v1/admin", adminRouter);
    app.use("/api/v1/lesson", lessonRouter);
    app.use("/api/v1/user-enroll", enrollRouter);
    app.use("/api/v1/contact", contactRouter);

    if (process.env.NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "client/build")));

      // SPA fallback: serve index.html for any unknown route
      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client/build", "index.html"));
      });
    }

    app.listen(port, () => {
      console.log(`database running on port http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
