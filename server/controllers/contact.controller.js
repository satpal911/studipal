import Contact from "../models/contact.model";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Create contact
export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    // Validate fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Save contact to DB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Setup transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    // Admin Email
    const mailOptions = {
      from: `"${name}" <${email}>`,
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

// Get all contacts
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({
      success: true,
      message: "Contacts fetched successfully.",
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts.",
      error: error.message,
    });
  }
};

// Get single contact by ID
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found." });
    }
    res.status(200).json({
      success: true,
      message: "Contact fetched successfully.",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching contact.",
      error: error.message,
    });
  }
};

// Delete all contacts
export const deleteAll = async (req, res) => {
  try {
    await Contact.deleteMany();
    res.status(200).json({
      success: true,
      message: "All contacts deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete all contacts.",
      error: error.message,
    });
  }
};
// Delete contact by ID
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found." });
    }
    res
      .status(200)
      .json({ success: true, message: "Contact deleted successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting contact.",
      error: error.message,
    });
  }
};
