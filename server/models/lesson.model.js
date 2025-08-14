const mongoose = require("mongoose")

const  lessonSchema = new mongoose.Schema({
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
    }
},{timestamps: true})

module.exports = new mongoose.model("Lesson", lessonSchema)