const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Verify connection on startup
    this.verifyConnection();
  }
  
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service connected successfully');
    } catch (error) {
      console.error('Email service connection failed:', error.message);
    }
  }
  
  async sendBookingConfirmation({ name, email, message }) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'LifeBet - Consultation Request Received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #3B82F6; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">LifeBet Recovery</h1>
            <p style="margin: 10px 0 0 0;">Your Partner in Recovery</p>
          </div>
          
          <div style="padding: 30px 20px; background-color: #f8f9fa;">
            <h2 style="color: #1F2937; margin-top: 0;">Hello ${name},</h2>
            
            <p style="color: #374151; line-height: 1.6;">
              Thank you for taking this brave step towards recovery. We have received your consultation request and want you to know that you're not alone in this journey.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6;">
              <h3 style="color: #1F2937; margin-top: 0;">What happens next:</h3>
              <ul style="color: #374151; line-height: 1.6;">
                <li>One of our trained specialists will contact you within 24 hours</li>
                <li>We'll schedule a free, confidential consultation at your convenience</li>
                <li>All conversations are completely private and judgment-free</li>
                <li>You'll receive personalized guidance and support resources</li>
              </ul>
            </div>
            
            ${message ? `
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #1F2937; margin-top: 0;">Your message:</h4>
              <p style="color: #374151; font-style: italic;">"${message}"</p>
            </div>
            ` : ''}
            
            <div style="background-color: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #92400E; margin: 0; font-weight: bold;">
                📞 Need immediate support? Call the National Problem Gambling Helpline: 1-800-522-4700
              </p>
            </div>
            
            <p style="color: #374151; line-height: 1.6;">
              Remember, seeking help is a sign of strength, not weakness. You've already taken the hardest step by reaching out.
            </p>
            
            <p style="color: #374151;">
              Warm regards,<br>
              <strong>The LifeBet Recovery Team</strong>
            </p>
          </div>
          
          <div style="background-color: #1F2937; color: #9CA3AF; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">This email was sent because you requested a consultation through our website.</p>
            <p style="margin: 5px 0 0 0;">
              Visit us at <a href="https://vibecode.n8nsecure.com" style="color: #3B82F6;">vibecode.n8nsecure.com</a>
            </p>
          </div>
        </div>
      `
    };
    
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Confirmation email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      throw new Error('Failed to send confirmation email: ' + error.message);
    }
  }
  
  async sendAdminNotification({ name, email, message }) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New LifeBet Consultation Request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #DC2626; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">🚨 New Consultation Request</h1>
            <p style="margin: 10px 0 0 0;">Requires follow-up within 24 hours</p>
          </div>
          
          <div style="padding: 20px; background-color: #f8f9fa;">
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1F2937; margin-top: 0;">Contact Information</h2>
              <p style="color: #374151;"><strong>Name:</strong> ${name}</p>
              <p style="color: #374151;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p style="color: #374151;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            ${message ? `
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #1F2937; margin-top: 0;">Client's Message:</h3>
              <p style="color: #374151; line-height: 1.6; border-left: 3px solid #3B82F6; padding-left: 15px; margin-left: 10px;">${message}</p>
            </div>
            ` : `
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="color: #6B7280; font-style: italic;">No additional message provided.</p>
            </div>
            `}
            
            <div style="background-color: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #92400E; margin-top: 0;">⏰ Action Required</h4>
              <p style="color: #92400E; margin: 0;">
                Please respond to this consultation request within 24 hours as promised to the client.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${email}?subject=LifeBet Consultation Follow-up&body=Dear ${name},%0D%0A%0D%0AThank you for reaching out to LifeBet for a consultation..." 
                 style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Reply to Client
              </a>
            </div>
          </div>
        </div>
      `
    };
    
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Admin notification sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      throw new Error('Failed to send admin notification: ' + error.message);
    }
  }
}

module.exports = new EmailService(); 