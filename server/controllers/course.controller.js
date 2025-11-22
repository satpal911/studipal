const Course = require("../models/course.model")
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

const addCourse = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const thumbnail = req.file

    // Validate required fields
    if (!name || !description || !category || !thumbnail) {
      return res.status(400).json({
        status: 0,
        message: "All required fields must be provided"
      });
    }

     // Upload thumbnail to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "studipal/courses",
    });

    // remove local file
    fs.unlinkSync(req.file.path);

    const course = new Course({
      name,
      description,
      category,
      thumbnail: result.secure_url,
      mentor: req.mentor ? req.mentor._id : undefined, // set from auth if available
      lessons: [], 
      studentsEnrolled: [], 
      status: "pending"
    });

    const savedCourse = await course.save();

    res.status(201).json({
      status: 1,
      message: "Course added successfully",
      data: savedCourse
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: 0,
      message: `Server error: ${error.message}`
    });
  }
};



const getAllCourses = async(req, res) => {
  try {
    const allCourses = await Course.find({ status: "approved" }).populate("mentor", "name");

    res.status(200).json({
      status: 1,
      message: "All approved courses fetched successfully",
      data: allCourses, // frontend should use res.data.data
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: `Server error ${error.message}`,
    });
  }
};



const getOneCourse = async(req, res) => {
   try {
     const {id} = req.params

    const oneCourse = await  Course.findById({_id:id}).populate("mentor", "name email");


    res.status(200).json({
        status:1,
        message:"One course fetched successfully",
        data: oneCourse
    })
   } catch (error) {
    res.status(500).json({
        status:0,
        message:`server error ${error.message}`
    })
   }
}

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category } = req.body;

    // Find the existing course
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ status: 0, message: "Course not found" });
    }

    // Ensure only the mentor who owns the course can update
    if (course.mentor.toString() !== req.mentor._id.toString()) {
      return res.status(403).json({
        status: 0,
        message: "You are not authorized to update this course",
      });
    }

    // Prepare update object
    const updateData = {
      name: name || course.name,
      description: description || course.description,
      category: category || course.category,
    };

    // ✅ Handle thumbnail replacement
    if (req.file) {
      // Delete old Cloudinary thumbnail if exists
      if (course.thumbnail) {
        try {
          const publicId = course.thumbnail
            .split("/")
            .slice(-1)[0]
            .split(".")[0];
          await cloudinary.uploader.destroy(`studipal/courses/${publicId}`);
        } catch (err) {
          console.warn("Old thumbnail deletion failed:", err.message);
        }
      }

      // Upload new one
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "studipal/courses",
      });
      fs.unlinkSync(req.file.path);
      updateData.thumbnail = result.secure_url;
    }

    // ✅ Update the existing course directly
    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      status: 1,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res
      .status(500)
      .json({ status: 0, message: `Server error: ${error.message}` });
  }
};



const deleteCourse = async(req, res) => {
    try {
        const {id} = req.params

    const deleteCourse = await Course.findByIdAndDelete({_id:id})

    res.status(200).json({
        status:1,
        message:"course deleted successfully",
        data: deleteCourse
    })
    } catch (error) {
        res.status(500).json({
            status:0,
            message:`server error ${error.message}`
        })
    }
};

//  Get all courses for mentor
const getAllCoursesMentor = async (req, res) => {
    try {
        const allCoursesMentor = await Course.find({ mentor: req.mentor._id }).populate("mentor", "name email");
;
        res.status(200).json({
            status: 1,
            message: "All courses of mentor fetched successfully",
            data: allCoursesMentor
        });
    } catch (error) {
        res.status(500).json({ status: 0, message: `Server error: ${error.message}` });
    }
};

const getPendingCourses = async (req, res) => {
  try {
    const pendingCourses = await Course.find({ status: "pending" })
                                       .populate("mentor", "name email");

    res.status(200).json({
      status: 1,
      message: "All pending courses fetched successfully",
      data: pendingCourses
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: `Server error: ${error.message}`
    });
  }
};

module.exports = {addCourse, getAllCourses, getOneCourse, deleteCourse, updateCourse, getAllCoursesMentor,getPendingCourses}
