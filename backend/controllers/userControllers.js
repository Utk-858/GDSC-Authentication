const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const nodemailer = require('nodemailer');
require('dotenv').config();


const sendWelcomeEmail = async (email,name) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email, 
        subject: 'Welcome to Our App', 
        text: `Hello ${name},\n\nThank you for registering on our app.\n\nBest Regards,\nYour App Team`, // plain text body
        html: `<b>Hello ${name}</b><br>Thank you for registering on our app.<br><br>Best Regards,<br>Your App Team` // html body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error("User Already Exists");
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {

        await sendWelcomeEmail(user.email, user.name);
        
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        throw new Error('Error occurred');
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            token: generateToken(user._id),
        });
    } else {
        throw new Error('Invalid Credentials!');
    }
});

module.exports = { registerUser, authUser };
