import { Admission } from "../models/admission.model.js";
import { ApiRes } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";
import { sendCounsellingEmail } from "../utils/emails/send.counselling.email.js";
import { sendCounsellingSms } from "../utils/sms/send.counselling.sms.js";

const sendEmailAndSmsForCounselling = asyncHandler(async (req, res) => {
  const { date, time, docId } = req.body;

  // Validation for missing fields
  if (!date || !time || !docId) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Date, time, and docId are required"));
  }

  try {
    // Fetch the Admission details
    const admission = await Admission.findById(docId);

    // Check if admission document exists
    if (!admission) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Admission document not found"));
    }

    const guardianInfo = admission.parent_guardian_details.guardian_information;
    const studentDetails = admission.student_details;
    const guardianName = guardianInfo.name;
    const email = guardianInfo.email;
    const phone = guardianInfo.contact_no;
    const studentName = `${studentDetails.first_name} ${studentDetails.last_name}`;

    // Ensure necessary information exists
    if (!email && !phone) {
      return res
        .status(400)
        .json(
          new ApiRes(400, null, "Either email or phone number is required")
        );
    }

    // Define email and SMS tasks
    const emailPromise = sendCounsellingEmail(
      guardianName,
      email,
      studentName,
      date,
      time
    );

    // Add SMS sending function here:
    const smsPromise = sendCounsellingSms(
      guardianName,
      phone,
      studentName,
      date,
      time
    );

    // Run email and SMS sending concurrently (if SMS is enabled)
    await Promise.all([emailPromise, smsPromise]);

    admission.counselling_date = date;
    admission.counselling_time = time;
    admission.application_status = "UNDER-COUNSELLING";
    await admission.save();

    return res
      .status(200)
      .json(new ApiRes(200, null, "Email and SMS sent successfully"));
  } catch (error) {
    // Log specific error for better debugging
    console.error("Error in sendEmailAndSmsForCounselling:", error);
    return res.status(500).json(new ApiRes(500, null, "Internal server error"));
  }
});

export { sendEmailAndSmsForCounselling };
