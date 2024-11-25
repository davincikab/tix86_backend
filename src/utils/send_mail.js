const nodemailer = require('nodemailer');
require("dotenv").config();

const mailSender = async (email, title, body) => {
  console.log("Body Mail")
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      }
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: process.env.EMAIL_HOST_USER,
      to: email,
      subject: title,
      html: body,
    });
    // console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};


module.exports = mailSender;