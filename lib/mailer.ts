import nodemailer from 'nodemailer';

export const sendApprovalMail = async (email: string) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Account Approved',
        text: 'Your account has been approved. You can now login using your email and password.'
    });
};
