const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/User')

exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            })
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(err) {
            return res.status(401).json({
                success: false,
                message: 'token is invalid'
            }) 
        }
        next();
    }
    catch(error) {
        return res.status(401).json({
            success: false,
            message: "Something went wromg while validating token"
        })
    }
}

exports.isStudent = async (req, res, next) => {
    try {
        if(req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Students only",
            })
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified"
        })
    }
}

exports.isInstructor = async (req, res, next) => {
    try {
        if(req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Instructor only",
            })
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified"
        })
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        if(req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin only",
            })
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified"
        })
    }
}