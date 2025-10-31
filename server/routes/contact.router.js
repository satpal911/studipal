const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ message: "All fields are required" });

    //Message that goes to you (admin)
    const adminEmailContent = `
      <h3>New Contact Message from Studipal</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    await sendEmail(
      "satpal61106@gmail.com", // your admin email
      "Studipal New Contact Message",
      adminEmailContent
    );

    // Auto-reply to sender (user)
    const userReply = `
      <h3>Hi ${name},</h3>
      <p>Thank you for contacting <strong>Studipal</strong>! 🎓</p>
      <p>We’ve received your message and our team will get back to you soon.</p>
      <br/>
      <p>Here’s a copy of your message:</p>
      <blockquote style="color:#555;border-left:3px solid #6366f1;padding-left:10px;">
        ${message}
      </blockquote>
      <p>Best regards,<br/>The Studipal Team</p>
    `;

    await sendEmail(
      email, // user's email
      " We’ve received your message | Studipal Support",
      userReply
    );

    res.status(200).json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error(" Error sending contact email:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;
