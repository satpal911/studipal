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
    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    status: {                                          //admin will approve or reject
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    originalCourseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Course", courseSchema);
