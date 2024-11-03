import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // e.g., 'smtp.gmail.com' for Gmail
      port: process.env.EMAIL_PORT, // typically 587 or 465 for secure
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // email address
        pass: process.env.EMAIL_PASS, // email password or app-specific password
      },
    });

    // Set up email options
    const mailOptions = {
      from: process.env.EMAIL_FROM, // sender address, e.g., 'your-email@example.com'
      to,
      subject,
      text,
      html,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
};

export default sendEmail;
