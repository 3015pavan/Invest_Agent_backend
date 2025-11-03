import Alert from "../models/Alert.js";
import nodemailer from "nodemailer";

/* -------------------------------
  Day 8: Alerts & Notifications
--------------------------------*/

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,      // Add in .env
    pass: process.env.EMAIL_PASS,
  },
});

// Send alert email
const sendEmailAlert = async (to, subject, text) => {
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
};

// Trigger alert
export const triggerAlert = async (req, res) => {
  const { type, message } = req.body;
  if (!type || !message) return res.status(400).json({ message: "Type and message required" });

  try {
    const alert = await Alert.create({ user: req.user.id, type, message });

    // Send email notification
    await sendEmailAlert(req.user.email, `Portfolio Alert: ${type}`, message);

    res.status(200).json({ message: "Alert created and email sent", alert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get user alerts
export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Mark alert as read
export const markAlertRead = async (req, res) => {
  const { id } = req.params;
  try {
    const alert = await Alert.findByIdAndUpdate(id, { read: true }, { new: true });
    res.status(200).json({ message: "Alert marked as read", alert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
