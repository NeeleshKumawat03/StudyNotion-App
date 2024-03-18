const User = require('../models/User')
const mailSender = require('../utils/mailSender')
const bcrypt = require('bcrypt');
const crypto = require('crypto')

exports.resetPasswordToken = async(req, res) => {
    try {
        const email = req.body.email;

        const user = await User.findOne({email: email});
        if(!user) {
            return res.json({
                success: false,
                message: "Your email is not registered wit us"
            })
        }
    
        const token = crypto.randomUUID();
    
        const updatedDetails = await User.findOneAndUpdate(
            {email: email},
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000
            },
            {new: true}
        );
    
        const url = `http://localhost:3000/update-password/${token}`
        await mailSender(email, "Password Rest Link", `Password Reset Link: ${url}`);
    
        return res.json({
            success: true,
            message: "Email Successfully, please check email and change password"
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

exports.resetPassword = async(req, res) => {
    try {
        const {password, confirmPassword, token} = req.body;
        if(password !== confirmPassword) {
            return res.json({
                success: false,
                message: "Password not matching"
            })
        }

        const userDetails = await User.findOne({token, token});
        if(!userDetails) {
            return res.json({
                success: false,
                message: "Token is Invalid"
            })
        }

        if(userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: "Token is expired, please regenerate token"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate(
            {token: token},
            {password: hashedPassword},
            {new: true}
        )

        return res.status(200).json({
            success: true,
            message: "Password reset successful"
        })
    }
    catch(error) {
        console.log(error);
        returnstatus(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
    
}

