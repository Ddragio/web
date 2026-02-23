import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async (
    to: string,
    subject: string,
    html: string
): Promise<void> => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'Gyan Sammaan <noreply@gyansammaan.com>',
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error('Email send error:', error);
        throw new Error('Failed to send email');
    }
};

export const sendWelcomeEmail = async (name: string, email: string): Promise<void> => {
    const html = `
    <div style="font-family: 'Noto Sans', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1A7A3C, #1565C0); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">ज्ञान सम्मान</h1>
        <p style="color: #E0E0E0; margin: 5px 0 0;">Gyan Sammaan</p>
      </div>
      <div style="padding: 30px; background: #F0FAF4;">
        <h2 style="color: #1A7A3C;">Welcome, ${name}! 🎉</h2>
        <p>Thank you for registering on Gyan Sammaan. Start your preparation journey for BPSC, UPSC, and other competitive exams today!</p>
        <a href="${process.env.FRONTEND_URL}/courses" style="display: inline-block; background: #FFA000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Browse Courses</a>
      </div>
    </div>
  `;
    await sendEmail(email, 'Welcome to Gyan Sammaan! 🎉', html);
};

export const sendPurchaseEmail = async (
    name: string,
    email: string,
    courseName: string,
    amount: number
): Promise<void> => {
    const html = `
    <div style="font-family: 'Noto Sans', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1A7A3C, #1565C0); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">ज्ञान सम्मान</h1>
      </div>
      <div style="padding: 30px; background: #F0FAF4;">
        <h2 style="color: #1A7A3C;">Purchase Confirmed! ✅</h2>
        <p>Dear ${name},</p>
        <p>Your enrollment for <strong>${courseName}</strong> has been confirmed.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Course:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${courseName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Amount Paid:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">₹${amount}</td></tr>
        </table>
        <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: #FFA000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Go to Dashboard</a>
      </div>
    </div>
  `;
    await sendEmail(email, `Course Enrolled: ${courseName}`, html);
};

export default transporter;
