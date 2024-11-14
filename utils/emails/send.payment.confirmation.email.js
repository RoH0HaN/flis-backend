import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import fs from "fs";
import {
  SCHOOL_NAME,
  SCHOOL_ADDRESS,
  CONTACT_NUMBER,
} from "../../src/constants.js";
import { Logger } from "../logger.js";

async function sendPaymentConfirmationEmail(
  guardianName,
  guardianEmail,
  applicationId,
  receiptPath
) {
  if (!guardianEmail) {
    throw new Error("Recipient email is required.");
  }

  // Nodemailer config
  let config = {
    service: "gmail",
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_EMAIL_PASS,
    },
  };

  let transporter = nodemailer.createTransport(config);

  // Mailgen configuration
  let mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: SCHOOL_NAME || "Your School Name",
      link: "https://flis.in/",
      logo: "https://flis.in/_next/image?url=%2Flogo%2FLogo.png&w=64&q=75", // optional: add school logo
    },
  });

  // Email content generation
  const emailBody = {
    body: {
      name: guardianName,
      intro: `Dear ${guardianName},`,
      table: {
        data: [
          {
            "Application ID": applicationId,
            Fee: "500",
            Status: "Paid",
          },
        ],
        columns: {
          customWidth: {
            "Application ID": "40%",
            Fee: "30%",
            Status: "30%",
          },
        },
      },
      action: {
        instructions: `Thank you for completing the admission form for ${SCHOOL_NAME}. If you have any questions, please reach out to us at ${CONTACT_NUMBER}.`,
        button: {
          color: "#22BC66",
          text: "Visit School Website",
          link: "https://flis.in/",
        },
      },
      outro: `We look forward to welcoming your child to our school!`,
    },
  };

  // Generate the email body in HTML and text formats
  const emailContent = mailGenerator.generate(emailBody);
  const emailText = mailGenerator.generatePlaintext(emailBody);

  // Nodemailer mail options
  let mailOptions = {
    from: process.env.MAILER_EMAIL,
    to: guardianEmail,
    subject: "Admission Form Payment Confirmation",
    html: emailContent,
    text: emailText,
    attachments: [
      {
        filename: "PaymentReceipt.pdf",
        path: receiptPath,
      },
    ],
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    Logger(
      `Admission payment confirmation email sent : ${info.response}`,
      "info"
    );
    fs.unlinkSync(receiptPath);
  } catch (error) {
    Logger(error, "error");
    throw error;
  }
}

export { sendPaymentConfirmationEmail };
