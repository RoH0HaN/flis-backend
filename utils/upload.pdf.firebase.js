import { storageRef } from "../db/firebase.storage.js";
import fs from "fs";
import util from "util";
import { Logger } from "./logger.js";

// Promisify fs.readFile to use async/await
const readFileAsync = util.promisify(fs.readFile);

async function uploadPdfToFirebase(
  filePath,
  folderName = "documents",
  studentId,
  documentType
) {
  try {
    // Read the PDF file from the file system
    const fileData = await readFileAsync(filePath);

    // Create a blob from the file data
    const fileBlob = new Blob([fileData]);

    const pdfName = `document_${studentId}_${documentType}.pdf`;

    // Define the folder path for the upload
    const folderPath = `${folderName}/${pdfName}`;

    // Upload the file to Firebase storage
    const uploadTask = storageRef.child(folderPath).put(fileBlob, {
      contentType: "application/pdf",
    });

    // Wait for the upload to complete
    const snapshot = await uploadTask;

    // Get the download URL of the uploaded PDF
    const downloadURL = await snapshot.ref.getDownloadURL();

    // Remove the file from the local file system after uploading
    fs.unlinkSync(filePath);

    Logger("PDF uploaded successfully", "info");

    return downloadURL;
  } catch (error) {
    Logger(error, "error");
    throw error;
  }
}

export { uploadPdfToFirebase };
