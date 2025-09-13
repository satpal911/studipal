const { default: mongoose } = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  progress: {
    type: Number,
    default: 0, // percentage (0–100)
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
});

const enrollModel = new mongoose.model("Enroll", enrollmentSchema);
module.exports = enrollModel;
