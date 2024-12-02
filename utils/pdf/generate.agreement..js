import fs from "fs";
import { fileURLToPath } from "url";
import pdfMake from "pdfmake";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Font setup
const fonts = {
  Roboto: {
    normal: path.join(__dirname, "../../fonts/Roboto-Regular.ttf"),
    bold: path.join(__dirname, "../../fonts/Roboto-Bold.ttf"),
    italics: path.join(__dirname, "../../fonts/Roboto-Italic.ttf"),
    bolditalics: path.join(__dirname, "../../fonts/Roboto-BoldItalic.ttf"),
  },
};

const printer = new pdfMake(fonts);

async function generateAgreement(res, studentInfo, guardianInfo, feesInfo) {
  // Today's date for dynamic insertion
  const today = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const docDefinition = {
    content: [
      {
        image: path.join(__dirname, "../../public/assets/school_logo.jpg"),
        width: 450,
        alignment: "center",
        margin: [0, 0, 0, 20],
      },
      {
        text: "GUARDIANS AND SCHOOL AGREEMENT",
        style: "header",
        alignment: "center",
      },

      {
        text: `\nThis Guardians and School Agreement ("Agreement") made and entered into on ${today}, between FUTURE LEADER'S INTERNATIONAL SCHOOL [ENGLISH MEDIUM] (hereinafter referred to as the "School"), located at Khojardanga, Near Lalbagh Court Road Station, Dahapara, Murshidabad-742149, and ${guardianInfo.guardianName || "N/A"} (hereinafter referred to as the "Guardian"), residing at ${guardianInfo.address || "N/A"}, collectively referred to as the "Parties".\n\n`,
        style: "body",
      },

      { text: "1. Student(s) Information:", style: "subheader" },
      {
        text: `1.1 The Guardians have enrolled their child(ren) at Future Leader's International School. The details of the student(s) are as follows:\n\n`,
        style: "body",
      },
      {
        text: `- Student's Name  :   ${studentInfo.studentName || "N/A"}\n- Father's Name    :   ${studentInfo.fatherName || "N/A"}\n- Mother's Name   :   ${studentInfo.motherName || "N/A"}\n- Date of Birth        :   ${studentInfo.dob || "N/A"}\n- Grade                    :   ${studentInfo.grade || "N/A"}\n- Academic Year    :   ${studentInfo.academicYear || "N/A"}
        ${
          feesInfo && feesInfo.length > 0
            ? feesInfo
                .map(
                  (fee) => `
        - ${fee.name} : ${fee.finalAmount || "N/A"}
      `
                )
                .join("")
            : "No fees information available."
        }`,
        style: "body",
      },

      { text: "2. School’s Commitments:", style: "subheader" },
      {
        text: "The School agrees to provide education and related services to the student(s) in accordance with the School’s curriculum and policies. The School shall maintain a safe and conducive learning environment for the student(s).\n\n",
        style: "body",
      },

      { text: "3. Guardians’ Commitments:", style: "subheader" },
      {
        ul: [
          "Ensure the student(s) attend school regularly and punctually, abiding by the school’s schedule and academic calendar.",
          "Support the student(s) in their studies and homework.",
          "Abide by the School’s rules and regulations, as communicated by the School from time to time.\n\n",
        ],
        style: "body",
      },

      { text: "4. Tuition and Fees:", style: "subheader" },
      {
        text: "The Guardians shall pay tuition and fees as determined by the School. The payment schedule, including due dates and payment methods, will be provided separately by the School.\n\n",
        style: "body",
      },

      { text: "5. Communication:", style: "subheader" },
      {
        text: "The School shall regularly communicate with the Guardians about the student(s)’ progress, school events, and important information through official channels such as emails, newsletters, and parent-teacher meetings.\n\n",
        style: "body",
      },

      { text: "6. Absences and Leave:", style: "subheader" },
      {
        text: "The Guardians shall inform the School in advance in case of the student(s)’ absence or leave requests, following the School’s specified procedures.\n\n",
        style: "body",
      },

      { text: "7. Termination of Agreement:", style: "subheader" },
      {
        text: "This Agreement shall remain in effect for the duration of the student(s)’ enrollment at the School, and it may be terminated by either party with written notice as per the School’s policies.\n\n",
        style: "body",
      },

      {
        text: "IN WITNESS WHEREOF, the parties have executed this Agreement on the date first above written.\n\n",
        style: "body",
      },
      {
        columns: [
          {
            text: `
                      FOR FUTURE LEADER'S INTERNATIONAL SCHOOL:\n\nSignature: ______________\nName: ISSAC HOSSAIN, Founder, FLIS\nDate: ${today}`,
            margin: [0, 20, 0, 0],
          },
          {
            text: `\nFOR STUDENT'S GUARDIAN:
                      \n\nSignature: ______________\nName: ${guardianInfo.guardianName || "N/A"}\nDate: ${today}`,
            margin: [90, 20, 0, 0],
          },
        ],
      },
    ],
    styles: {
      header: { fontSize: 22, bold: true },
      subheader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5] },
      body: { fontSize: 12, margin: [0, 5, 0, 5] },
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  const fileName = `${studentInfo.studentName}_agreement.pdf`;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

  pdfDoc.pipe(res);
  pdfDoc.end();
}

export { generateAgreement };
