const mongoose = require("mongoose")

const userSchema = new  mongoose.Schema({
    name:{
        type:  String,
        required: true
    },
    email:{
       type:  String,
        required: true
    },
    password:{
        type:  String,
        required: true
    },
    entrolledCourses:[{type: mongoose.Schema.Types.ObjectId,
        ref : "Course"}
    ],

    completeCourses: [{type: mongoose.Schema.Types.ObjectId,
        ref : "Course"}],

    pendingCourses: [{type: mongoose.Schema.Types.ObjectId,
        ref : "Course"}]
},
{timestamps: true})

module.exports = new mongoose.model("User", userSchema)