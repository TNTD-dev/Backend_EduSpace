const createTransporter = require("../configs/mailer_google_setup");
require("dotenv").config();

const sendBasicEmail = async ({ from, to, subject, html }) => {
  try {
    const transporter = await createTransporter();
    const mailOption = {
      from: from || `My App <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const infor = await transporter.sendMail(mailOption);
    console.log("Email sent: ", infor.messageId);
    return infor;
  } catch (err) {
    console.log("Something went wrong with creating sendEmail function", err);
    throw err;
  }
};

// Hàm gửi email xác nhận đăng ký
const sendVerificationEmail = async (to, token) => {
  const transporter = await createTransporter();
  const subject = "Verify your registration";
  const html = `
    <h1> Verify your registration </h1>
    <p>Please click the link below to verify your account</p>
    <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}">verify</a>
  `;
  return transporter.sendMail({ to, subject, html });
};

// Hàm gửi email đặt lại mật khẩu
const sendResetPasswordEmail = async (to, token) => {
  const transporter = await createTransporter();
  const subject = "Reset Password";
  const html = `
    <h1>Reset Your Password</h1>
    <p>Please click the link below to reset your password:</p>
    <a href="http://localhost:4003/auth/resetPassword?token=${token}&email=${to}">Reset Password</a>
  `;
  return transporter.sendMail({ to, subject, html });
};

// Hàm gửi email mời tham gia khóa học
const sendCourseInvitationEmail = async (
  from,
  to,
  courseName,
  invitationLink
) => {
  const transporter = await createTransporter();
  const subject = "Course Invitation";
  const html = `
    <h1>You're Invited to a Course</h1>
    <p>You have been invited to join the course "${courseName}"</p>
    <p>Please click the link below to accept the invitation:</p>
    <a href="${invitationLink}">Accept Invitation</a>
  `;
  return transporter.sendMail({ from, to, subject, html });
};

module.exports = {
  sendBasicEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendCourseInvitationEmail,
};
