const mongoose = require("mongoose");

const enrolledCourseSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  progress: {
    type: Number,
    default: 0,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    // remove this old one if you're not using separate Enroll model
    // enrollments: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Enroll",
    // },

    enrolledCourses: [enrolledCourseSchema],   // ✅ structured array
    completedCourses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
    ],
    pendingCourses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
