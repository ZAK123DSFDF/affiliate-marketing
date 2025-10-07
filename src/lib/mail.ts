import nodemailer from "nodemailer"

export const sendVerificationEmail = async (to: string, link: string) => {
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 17422, // MailDev SMTP
    secure: false,
  })

  await transporter.sendMail({
    from: '"Your App" <noreply@yourapp.com>',
    to,
    subject: "Verify your login",
    html: `<p>Click below to complete your login:</p>
           <a href="${link}">${link}</a>`,
  })
}
