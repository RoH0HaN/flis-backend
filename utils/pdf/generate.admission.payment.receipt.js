import fs from "fs";
import path from "path";
import PdfPrinter from "pdfmake";
import { fileURLToPath } from "url";
import { Logger } from "../logger.js"; // Ensure Logger isn't duplicating listeners

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

const printer = new PdfPrinter(fonts);

function getCurrentDateTime() {
  const now = new Date();

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true, // AM/PM format
  };

  return now.toLocaleString("en-US", options); // Formats the date in "MM/DD/YYYY, HH:MM:SS AM/PM"
}

async function generateAdmissionReceipt(data) {
  const docDefinition = {
    content: [
      {
        image: path.join(__dirname, "../../public/assets/doc_header.jpg"),
        width: 450,
        alignment: "center",
        margin: [0, 0, 0, 20],
      },
      {
        text: "PAYMENT RECEIPT FOR APPLICATION FORM",
        style: "header",
        alignment: "center",
        margin: [0, 20, 0, 20],
      },
      {
        table: {
          widths: ["auto", "*"], // Defines two columns: one auto width and the other taking the remaining space
          body: [
            [
              { text: "Application ID", style: "tableHeader" },
              { text: data.applicationId, style: "details" },
            ],
            [
              { text: "Student's Name", style: "tableHeader" },
              { text: data.studentName, style: "details" },
            ],
            [
              { text: "Mother's Name", style: "tableHeader" },
              { text: data.motherName, style: "details" },
            ],
            [
              { text: "Father's Name", style: "tableHeader" },
              { text: data.fatherName, style: "details" },
            ],
            [
              { text: "Class", style: "tableHeader" },
              { text: data.class, style: "details" },
            ],
          ],
        },
        layout: {
          defaultBorder: true, // Ensures borders are applied to all cells
          hLineWidth: (i, node) => (i === 0 ? 1 : 0.5), // Adjusts horizontal line width (0.5 for small border thickness)
          vLineWidth: (i) => (i === 0 ? 1 : 0.5), // Adjusts vertical line width (0.5 for small border thickness)
          hLineColor: "#000000", // Horizontal line color (black)
          vLineColor: "#000000", // Vertical line color (black)
          paddingLeft: (i) => 10, // Adds padding to the left of the cells
          paddingRight: (i) => 10, // Adds padding to the right of the cells
          paddingTop: (i) => 5, // Adds padding to the top of the cells
          paddingBottom: (i) => 5, // Adds padding to the bottom of the cells
        },
        margin: [0, 0, 0, 20],
      },
      {
        table: {
          widths: ["auto", "*"], // Similar structure for this table
          body: [
            [
              { text: "Received Amount", style: "tableHeader" },
              { text: data.receivedAmount, style: "details" },
            ],
            [
              { text: "Transaction ID", style: "tableHeader" },
              { text: data.transactionId, style: "details" },
            ],
            [
              { text: "Date & Time", style: "tableHeader" },
              { text: getCurrentDateTime(), style: "details" },
            ],
          ],
        },
        layout: {
          defaultBorder: true, // Ensures borders are applied to all cells
          hLineWidth: (i, node) => (i === 0 ? 1 : 0.5), // Adjusts horizontal line width (0.5 for small border thickness)
          vLineWidth: (i) => (i === 0 ? 1 : 0.5), // Adjusts vertical line width (0.5 for small border thickness)
          hLineColor: "#000000", // Horizontal line color (black)
          vLineColor: "#000000", // Vertical line color (black)
          paddingLeft: (i) => 10, // Adds padding to the left of the cells
          paddingRight: (i) => 10, // Adds padding to the right of the cells
          paddingTop: (i) => 5, // Adds padding to the top of the cells
          paddingBottom: (i) => 5, // Adds padding to the bottom of the cells
        },
        margin: [0, 0, 0, 20],
      },
      "\n\n",
      {
        text: `Payment Made (In Words): ${data.amountInWords}`,
        style: "details",
        italics: true,
      },
      "\n\n",
      {
        text: "---------------------------------------------------",
        alignment: "center",
      }, // Divider line before footer text
      {
        text: "*This receipt is electronically generated and no signature required*",
        style: "footer",
        alignment: "center",
      },
      {
        text: "---------------------------------------------------",
        alignment: "center",
      }, // Divider line after footer text
    ],
    styles: {
      header: {
        fontSize: 16,
        bold: true,
      },
      details: {
        fontSize: 12,
        margin: [0, 5, 0, 5],
      },
      footer: {
        fontSize: 10,
        color: "gray",
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: "black",
        fillColor: "#f0f0f0",
        alignment: "left",
        padding: 5,
      },
    },
  };

  const pdfPath = path.join(
    __dirname,
    `../../public/temp/receipt_${data.applicationId}.pdf`
  );

  return new Promise((resolve, reject) => {
    try {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const writeStream = fs.createWriteStream(pdfPath);

      writeStream.setMaxListeners(15); // Increase listeners for specific cases if needed

      pdfDoc.pipe(writeStream);
      pdfDoc.end();

      writeStream.on("finish", () => {
        Logger("PDF generated successfully", "info");
        resolve(pdfPath);
      });

      writeStream.on("error", (err) => {
        Logger(err, "error");
        reject(err);
      });
    } catch (err) {
      Logger(err, "error");
      reject(err);
    }
  });
}

export { generateAdmissionReceipt };
