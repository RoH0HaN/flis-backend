import { storageRef } from "../db/firebase.storage.js";
import { Logger } from "./logger.js";

async function deleteFromFirebase(downloadURL) {
  try {
    // Extract the file path from the download URL
    const baseUrl =
      "https://firebasestorage.googleapis.com/v0/b/flis-storage.appspot.com/o/";
    const encodedFilePath = downloadURL.replace(baseUrl, "").split("?")[0];
    const filePath = decodeURIComponent(encodedFilePath);

    // Get a reference to the file in Firebase Storage
    const fileRef = storageRef.child(filePath);

    // Delete the file
    await fileRef.delete();

    Logger("File deleted successfully", "info");
    return true;
  } catch (error) {
    Logger(error, "error");
    throw error;
  }
}

export { deleteFromFirebase };
