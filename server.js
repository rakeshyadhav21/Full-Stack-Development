const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();  // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json()); // To parse JSON requests

// Create a transporter object using your email service (Gmail in this case)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Route to generate OTP and send it to the user's email
app.post('/api/send-otp', (req, res) => {
  const { email } = req.body; // Get email from the request body

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Email message content
  const message = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Sign-Up',
    text: `Your OTP for sign-up is: ${otp}`
  };

  // Send email with OTP
  transporter.sendMail(message, (err, info) => {
    if (err) {
      return res.status(500).json({ error: "Failed to send OTP" });
    }
    // OTP sent successfully, return the OTP for validation in frontend
    res.status(200).json({ otp, message: 'OTP sent to your email' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
