const mongoose = require("mongoose")

const mentorSchema = new mongoose.Schema({
    name:{
         type: String,
        required: true
    },
    email:{
         type: String,
        required: true
    },
    password:{
         type: String,
        required: true
    },
    course:{
        type: String,
        // required: true
    },
    expertise:{
        type: String,
        // required: true
    }
},{
    timestamps: true
})

module.exports = new mongoose.model("Mentor", mentorSchema)