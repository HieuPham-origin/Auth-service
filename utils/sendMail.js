const nodemailer = require('nodemailer');
const User = require('../models/user.model');
const { sendQueue } = require('./producer');
require('dotenv').config();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    }
});

const sendSharingNoteEmail = async (userId, emailReceived, noteId) => {
    try {
        console.log('User ID:', userId);
        console.log('Email Received:', emailReceived);
        console.log('Note ID:', noteId);

        // Fetch sender and receiver user data
        const user = await User.findById({ _id: userId });
        if (!user) {
            console.error('Sender not found');
            return;
        }

        const userReceived = await User.findOne({ username: emailReceived });
        if (!userReceived || !userReceived.email) {
            console.error('Receiver not found or no valid email');
            return;
        }

        const acceptLink = `http://localhost/api/note/accept?userId=${userReceived._id}&noteId=${noteId}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userReceived.email, // Ensure email is valid
            subject: `User ${user.email} wants to share a note with you`,
            text: `Click on this link to view the shared note: ${acceptLink}.`,
        };

        // Send email
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return;
            }
            console.log('Email sent:', info.response);

            // // Send message to RabbitMQ after successful email
            // await sendQueue(
            //     { sender: user._id, receiver: userReceived._id, noteId },
            //     'accept_queue'
            // );
        });
    } catch (error) {
        console.error('Error in sendSharingNoteEmail:', error.message);
    }
};

module.exports = sendSharingNoteEmail;
