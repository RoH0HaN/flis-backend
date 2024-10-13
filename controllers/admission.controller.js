import { Admission } from "../models/admission.model.js";
import { ApiRes } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";
import { uploadImageToFirebase } from "../utils/upload.images.firebase.js";

const submitAdmissionFrom = asyncHandler(async (req, res) => {
  try {
    const {
      student_details,
      parent_guardian_details,
      communication_address,
      other_details,
      bank_details,
    } = req.body;

    const studentPhotoUrl = await uploadImageToFirebase(
      req.file.path,
      "student_images"
    );
    student_details.student_photo = studentPhotoUrl;

    // Creating a new admission document
    const newAdmission = new Admission({
      student_details,
      parent_guardian_details,
      communication_address,
      other_details,
      bank_details,
    });

    // Save the new admission to the database
    await newAdmission.save();

    return res
      .status(201)
      .json(new ApiRes(201, newAdmission, "Admission submitted successfully."));
  } catch (error) {
    console.error("Error submitting admission form:", error);
    return res
      .status(500)
      .json(
        new ApiRes(500, null, "An error occurred while submitting the form.")
      );
  }
});

export { submitAdmissionFrom };
