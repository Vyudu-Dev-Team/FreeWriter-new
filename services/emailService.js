import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email - freeWriter',
    html: `
      <h1>Email Verification</h1>
      <p>Thank you for registering with freeWriter. Please click the link below to verify your email:</p>
      <a href="${process.env.CLIENT_URL}/verify-email?email=${email}">Verify Email</a>
      <p>If you did not create an account, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset - freeWriter',
    html: `
      <h1>Password Reset</h1>
      <p>You have requested to reset your password. Click the link below to reset your password:</p>
      <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};