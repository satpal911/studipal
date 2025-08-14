const Lesson = require("../models/lesson.model")

const addLesson = async (req,res) => {
        try {
            const {title, content, video} = req.body
    
        if(!title || !content || !video){
            return res.status(401).json({
                message:"All fields are required"
            })
        }
    
        const lesson = new Lesson({
            title,
            content,
            video
        });
    
       const savedLesson = await lesson.save()
    
        res.status(201).json({
            status:1,
            message:"Lesson added successfully",
            data: savedLesson
        })
        } catch (error) {
            res.status(500).json({
                status:0,
                message:`server error ${error.message}`
            })
        }
    
}

const getAllLessons = async (req,res) => {
    
}

const getOneLesson = async (req,res) => {
    
}

const deleteLesson = async (req,res) => {
    
}

const updateLesson = async (req,res) => {
    
}

module.exports = {addLesson, getAllLessons, getOneLesson, deleteLesson, updateLesson}