const mailSender = require("../../utils/send_mail");

async function sendVerificationEmail(email, otp) {
  console.log("Sending Email");
    try {
      const mailResponse = await mailSender(
        email,
        "Verification Email",
        `<div>
          <p style="font-size:16px; margin:0px;">Please confirm your OTP</p>
          <h3 style="font-size:16px;" >Here is your OTP code: ${otp}</h3>
        </div>`
      );
      console.log("Email sent successfully: ", mailResponse);
      return 
    } catch (error) {
      console.log("Error occurred while sending email: ", error);
      throw error;
    }
}

module.exports = sendVerificationEmail;