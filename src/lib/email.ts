"use server";
import nodemailer from "nodemailer";

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  // Local SMTP server configuration (MailDev/MailHog)
  const transporter = nodemailer.createTransport({
    host: "localhost", // MailDev/MailHog runs on your machine
    port: 1025, // Default SMTP port for these tools
    secure: false, // No TLS for local dev
    ignoreTLS: true, // Skip certificate verification
    // No auth needed for local dev
  });

  // Default "from" address for development
  const devFrom = "dev@localhost.com";

  try {
    const info = await transporter.sendMail({
      from: devFrom,
      to: to.toLowerCase().trim(),
      subject: subject.trim(),
      text: text.trim(),
    });

    console.log("Email sent (dev mode):", info.messageId);
    console.log("Preview URL: http://localhost:1080"); // MailDev web interface

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: "Failed to send email. Is your local MailDev/MailHog running?",
    };
  }
}
