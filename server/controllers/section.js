const Course = require('../models/Course');
const Section = require('../models/Section');
const SubSection = require("../models/SubSection");

exports.createSection = async(req, res) => {
    try {
        const {sectionName, courseId} = req.body;

        if(!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'Missing Properties'
            });
        }

        const newSection = await Section.create({sectionName});

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id
                }
            },
            {new: true}
        )
        // populate section ANd Subsection
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();
        return res.status(200).json({
            success: true,
            message: "Section Created Successfully",
            updatedCourse
        })
        
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create section, please try again",
            error: error.message
        })
    }
}

exports.updateSection = async(req, res) => {
    try {
        const {sectionName, sectionId, courseId} = req.body

        if(!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: 'Missing Properties'
            });
        }

        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new: true});

        const course = await Course.findById(courseId)
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        })
        .exec()

        return res.status(200).json({
            success: true,
            data: course,
            message: "Section Updated Successfully"
        })
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update section, please try again",
            error: error.message
        })
    }
}

exports.deleteSection = async(req, res) => {
    try {
        const {sectionId, courseId} = req.body;
        await Course.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId
            }
        })

        const section = await Section.findById(sectionId)

        await SubSection.deleteMany({_id: {$in: section.subSection}});
        await Section.findByIdAndDelete(sectionId);
        
        const course = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        })
        .exec()

        return res.status(200).json({
            success: true,
            data: course,
            message: "Section Deleted Successfully"
        })
    } 
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete section, please try again",
            error: error.message
        })
    }
}