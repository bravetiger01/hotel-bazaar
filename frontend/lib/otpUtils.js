import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Create Gmail transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Generate a 6-digit OTP
export function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Send OTP email using Gmail
export async function sendOrderOTP(email, otp) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Hotel Bazaar" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Verify your order',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7b3388;">Order Verification OTP</h2>
          <p>You have requested to place an order. Please use the following OTP to verify your order:</p>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
            <h1 style="color: #7b3388; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          <p>If you didn't request this OTP, please ignore this email.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is an automated message from Hotel Bazaar.
          </p>
        </div>
      `,
    };
    
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Gmail OTP email error:', error);
    return { success: false, error: error.message };
  }
}

// Verify OTP
export function verifyOTP(storedOTP, storedExpiry, providedOTP) {
  if (!storedOTP || !storedExpiry || !providedOTP) {
    return false;
  }

  // Check if OTP is expired
  if (new Date() > new Date(storedExpiry)) {
    return false;
  }

  // Check if OTP matches
  return storedOTP === providedOTP;
}
