const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["IT", "Marketing", "Language"],
        required: true
    },
   thumbnail: { 
  type: String, 
  required: function () { 
    // Only require thumbnail when adding a new course
    return this.status === "pending";
  } 
},

    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentor"
    },
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson"
    }],
    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    originalCourseId: { // for pending updates linked to old approved version
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Course", courseSchema);
