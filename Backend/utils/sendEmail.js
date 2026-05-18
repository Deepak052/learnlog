const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
    console.log(`[sendEmail] Preparing to send email to ${to}...`);
    console.log(`[sendEmail] Checking credentials - User exists: ${!!process.env.EMAIL_USER}, Pass exists: ${!!process.env.EMAIL_PASS}`);

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    console.log(`[sendEmail] Transporter created, attempting to send...`);

    try {
        const info = await transporter.sendMail({
            from: `"LearnLog" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log(`[sendEmail] Message sent successfully. MessageId: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`[sendEmail] CRITICAL ERROR inside sendEmail function:`, error);
        throw error;
    }
};

module.exports = sendEmail;
