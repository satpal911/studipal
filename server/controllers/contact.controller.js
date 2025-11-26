import Contact from "../models/contact.model";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const subject = "Contact Form Submission";
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Admin Email
    const mailOptions = {
      from: process.env.EMAIL_USER, 
      replyTo: email, 
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `,
    };

    // Confirmation to User
    const clientEmail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `We received your message: ${subject}`,
      html: `
        <h2>Thank You for Reaching Out!</h2>
        <p>Hi ${name},</p>
        <p>Thanks for contacting us. We’ve received your message and will respond shortly.</p>
        <hr/>
        <p><strong>Your Message:</strong></p>
        <p>${message}</p>
        <hr/>
        <p>Best regards,<br/>Satpal</p>
      `,
    };

    // Send both emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(clientEmail);

    res
      .status(200)
      .json({ success: true, message: "Form submitted successfully!" });
  } catch (err) {
    console.error("Error in submitContact:", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};








