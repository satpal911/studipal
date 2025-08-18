const mongoose = require("mongoose")

const  lessonSchema = new mongoose.Schema({
    courseId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Course",
  required: true
},
    title:{
         type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    videoUrl:{
        type: String,
        required: true
    },
    order: {
  type: Number,
  default: 1
}

},{timestamps: true})

module.exports = new mongoose.model("Lesson", lessonSchema)