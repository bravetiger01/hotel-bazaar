const crypto = require('crypto');
const { sendVerificationEmail } = require('./emailValidator');

// Generate a 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send OTP email using SendGrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendOrderOTP = async (email, otp) => {
  try {
    const msg = {
      to: email,
      from: process.env.EMAIL, // Must be a verified sender in SendGrid
      subject: 'Verify your order',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b35;">Order Verification OTP</h2>
          <p>You have requested to place an order. Please use the following OTP to verify your order:</p>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
            <h1 style="color: #ff6b35; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          <p>If you didn't request this OTP, please ignore this email.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is an automated message from your inventory management system.
          </p>
        </div>
      `
    };
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('SendGrid OTP email error:', error);
    return { success: false, error: error.message };
  }
};

// Verify OTP
const verifyOTP = (storedOTP, storedExpiry, providedOTP) => {
  if (!storedOTP || !storedExpiry || !providedOTP) {
    return false;
  }
  
  // Check if OTP is expired
  if (new Date() > new Date(storedExpiry)) {
    return false;
  }
  
  // Check if OTP matches
  return storedOTP === providedOTP;
};

module.exports = {
  generateOTP,
  sendOrderOTP,
  verifyOTP
}; 