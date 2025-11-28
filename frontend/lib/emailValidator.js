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

// Validate email domain by attempting to connect to its SMTP server
export async function validateEmailDomain(email) {
  try {
    const domain = email.split('@')[1];

    // List of disposable email providers to block
    const disposableDomains = [
      'tempmail.org',
      '10minutemail.com',
      'guerrillamail.com',
      'mailinator.com',
      'yopmail.com',
      'temp-mail.org',
      'fakeinbox.com',
      'sharklasers.com',
      'getairmail.com',
      'mailnesia.com',
      'trashmail.com',
      'tempr.email',
      'throwaway.email',
      'maildrop.cc',
      'guerrillamailblock.com',
    ];

    // Check if it's a disposable email
    if (disposableDomains.includes(domain.toLowerCase())) {
      return { valid: false, reason: 'disposable_email' };
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, reason: 'invalid_format' };
    }

    // Skip SMTP verification for now (requires valid email credentials)
    return { valid: true, reason: 'valid_email' };
  } catch (error) {
    console.error('Email validation error:', error);
    // If validation fails, we'll still allow the email but log it
    return { valid: true, reason: 'validation_failed_but_allowed' };
  }
}

// Send verification email using Gmail
export async function sendVerificationEmail(email, verificationToken) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Hotel Bazaar" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Verify your email address',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 0; text-align: center;">
                <table role="presentation" style="width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 40px 20px 40px;">
                      <h2 style="color: #7b3388; margin: 0 0 20px 0; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold;">
                        🏨 Verify Your Email Address
                      </h2>
                      <p style="margin: 0 0 30px 0; line-height: 1.6; color: #333; font-family: Arial, sans-serif; font-size: 16px;">
                        Thank you for signing up at Hotel Bazaar! Please click the button below to verify your email address and complete your registration.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 40px 30px 40px; text-align: center;">
                      <table role="presentation" style="margin: 0 auto;">
                        <tr>
                          <td style="border-radius: 8px; background-color: #7b3388;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/verify?token=${verificationToken}" 
                               style="display: inline-block; padding: 16px 32px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 8px;">
                              ✅ Verify Email Address
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 40px 20px 40px;">
                      <p style="margin: 0 0 15px 0; font-size: 14px; color: #666; font-family: Arial, sans-serif;">
                        If the button doesn't work, copy and paste this link into your browser:
                      </p>
                      <p style="margin: 0 0 20px 0; padding: 12px; background-color: #f8f9fa; border-radius: 4px; word-break: break-all; font-size: 13px; color: #333; font-family: monospace; border: 1px solid #e9ecef;">
                        ${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/verify?token=${verificationToken}
                      </p>
                      <p style="margin: 0; font-size: 12px; color: #999; font-family: Arial, sans-serif;">
                        ⏰ This link will expire in 24 hours for security reasons.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 40px 40px 40px; border-top: 1px solid #eee;">
                      <p style="margin: 0; font-size: 12px; color: #999; text-align: center; font-family: Arial, sans-serif;">
                        This email was sent by Hotel Bazaar. If you didn't create an account, please ignore this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };
    
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Gmail verification email error:', error);
    return { success: false, error: error.message };
  }
}

// Send order notification email to admin using Gmail
export async function sendOrderNotification(orderDetails, customerInfo) {
  try {
    const transporter = createTransporter();
    
    const productsHtml = orderDetails.products
      .map(
        (product) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${product.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${product.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">Rs. ${product.price}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">Rs. ${(product.price * product.quantity).toFixed(2)}</td>
      </tr>
    `
      )
      .join('');

    const mailOptions = {
      from: `"Hotel Bazaar" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_USER,
      replyTo: customerInfo.email,
      subject: `🛒 New Order from ${customerInfo.name} - Hotel Bazaar`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 0; text-align: center;">
                <table role="presentation" style="width: 700px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 40px 20px 40px;">
                      <h2 style="color: #7b3388; margin: 0 0 20px 0; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold;">
                        🛒 New Order Received
                      </h2>
                      <p style="margin: 0 0 30px 0; line-height: 1.6; color: #333; font-family: Arial, sans-serif; font-size: 16px;">
                        A new order has been placed on Hotel Bazaar. Here are the details:
                      </p>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 0 40px 20px 40px;">
                      <h3 style="color: #7b3388; margin: 0 0 15px 0; font-family: Arial, sans-serif; font-size: 18px;">
                        👤 Customer Information
                      </h3>
                      <table style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 6px;">
                        <tr>
                          <td style="padding: 12px; font-family: Arial, sans-serif; font-size: 14px; color: #333;">
                            <strong>Name:</strong> ${customerInfo.name || 'N/A'}<br>
                            <strong>Email:</strong> ${customerInfo.email || 'N/A'}<br>
                            <strong>Phone:</strong> ${customerInfo.phone || 'N/A'}<br>
                            <strong>Order Date:</strong> ${new Date(orderDetails.orderDate).toLocaleString()}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 40px 20px 40px;">
                      <h3 style="color: #7b3388; margin: 0 0 15px 0; font-family: Arial, sans-serif; font-size: 18px;">
                        📦 Order Details
                      </h3>
                      <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                        <thead>
                          <tr style="background-color: #7b3388;">
                            <th style="padding: 12px; color: white; font-family: Arial, sans-serif; text-align: left;">Product</th>
                            <th style="padding: 12px; color: white; font-family: Arial, sans-serif; text-align: center;">Quantity</th>
                            <th style="padding: 12px; color: white; font-family: Arial, sans-serif; text-align: right;">Price</th>
                            <th style="padding: 12px; color: white; font-family: Arial, sans-serif; text-align: right;">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${productsHtml}
                          <tr style="background-color: #f8f9fa; font-weight: bold;">
                            <td colspan="3" style="padding: 12px; border: 1px solid #ddd; text-align: right; font-family: Arial, sans-serif;">
                              <strong>Grand Total:</strong>
                            </td>
                            <td style="padding: 12px; border: 1px solid #ddd; text-align: right; font-family: Arial, sans-serif; color: #7b3388;">
                              <strong>Rs. ${orderDetails.total ? orderDetails.total.toFixed(2) : 'N/A'}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 20px 40px 40px 40px; border-top: 1px solid #eee;">
                      <p style="margin: 0 0 15px 0; font-size: 14px; color: #666; font-family: Arial, sans-serif;">
                        Please contact the customer to confirm the order and arrange delivery.
                      </p>
                      <p style="margin: 0; font-size: 12px; color: #999; text-align: center; font-family: Arial, sans-serif;">
                        This notification was sent automatically from Hotel Bazaar.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };
    
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Gmail order notification error:', error);
    return { success: false, error: error.message };
  }
}
