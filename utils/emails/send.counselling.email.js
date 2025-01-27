import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { Logger } from "../logger.js";
import {
  SCHOOL_NAME,
  SCHOOL_ADDRESS,
  CONTACT_NUMBER,
} from "../../src/constants.js";

function formatDate(date) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function formatTime(time) {
  const [hour, minute] = time.split(":");
  const hourInt = parseInt(hour, 10);
  const period = hourInt >= 12 ? "PM" : "AM";
  const hour12 = hourInt % 12 || 12;
  return `${hour12}:${minute} ${period}`;
}

async function sendCounsellingEmail(
  guardianName,
  guardianEmail,
  studentName,
  counsellingDate,
  counsellingTime
) {
  if (!guardianEmail) {
    throw new Error("Recipient email is required.");
  }

  const formattedDate = formatDate(counsellingDate);
  const formattedTime = formatTime(counsellingTime);

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
      logo: "https://flisindia.com/flis-gse/items/logos/flis-title-transparent.webp", // optional: add school logo
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
            "Student Name": studentName,
            "Counselling Date": formattedDate,
            "Counselling Time": formattedTime,
            Venue: SCHOOL_ADDRESS,
          },
        ],
        columns: {
          // Optionally customize column widths and alignment
          customWidth: {
            "Student Name": "25%",
            "Counselling Date": "25%",
            "Counselling Time": "25%",
            Venue: "25%",
          },
        },
      },
      action: {
        instructions: `Please ensure that both you and the student are available at the scheduled time. Should you need any further information, feel free to contact us at ${CONTACT_NUMBER}.`,
        button: {
          color: "#22BC66", // Optional action button color
          text: "View School Website",
          link: "https://flis.in/",
        },
      },
      outro: `We look forward to welcoming you and the student to our school community soon. If you have any further questions, feel free to reply to this email or call us directly.`,
    },
  };

  // Generate the email body in HTML and text formats
  const emailContent = mailGenerator.generate(emailBody);
  const emailText = mailGenerator.generatePlaintext(emailBody);

  // Nodemailer mail options
  let mailOptions = {
    from: process.env.MAILER_EMAIL,
    to: guardianEmail,
    subject: "Student Counselling Session Confirmation",
    html: emailContent, // HTML email content
    text: emailText, // Plain text version of the email
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    Logger(
      `Admission payment confirmation email sent : ${info.response}`,
      "info"
    );
  } catch (error) {
    Logger(error, "error");
    throw error;
  }
}

export { sendCounsellingEmail };
