import nodemailer from "nodemailer";

const sendOTP = async (email, otp) => {
  try {
    // create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // recipient’s email
      subject: "OTP to reset the password",
      text: `OTP for password reset:`,
      html: `<p>Your OTP to reset the password is: <br> <b>${otp}</b>. It is valid for 10 minutes.</p>`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendOTP;