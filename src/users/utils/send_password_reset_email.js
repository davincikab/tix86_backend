const mailSender = require("../../utils/send_mail");

async function sendPasswordResetLink(email, link) {
  console.log("Sending Email");
    try {
      const mailResponse = await mailSender(
        email,
        "Password Reset Link",
        `<div>
            <p style="font-size:16px; margin:0px;">Use the link below to reset your password</p>
            <a href="${link}">
                <div style="width:120px; font-size:16px; color:#fff; padding:5px 10px; background-color:#0163AA; border-radius:10px;">
                    Reset Password
                </div>
            </a>
        </div>`
      );
      console.log("Email sent successfully: ", mailResponse);
      return "success";
    } catch (error) {
      console.log("Error occurred while sending email: ", error);
      throw error;
    }
}

module.exports = sendPasswordResetLink;