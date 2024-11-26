import { Admission } from "../models/admission.model.js";
import crypto from "crypto";
import axios from "axios";
import mongoose from "mongoose";
import { ApiRes, validateFields } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";
import { uploadImageToFirebase } from "../utils/upload.images.firebase.js";
import { sendPaymentConfirmationEmail } from "../utils/emails/send.payment.confirmation.email.js";
import { generateAdmissionReceipt } from "../utils/pdf/generate.admission.payment.receipt.js";
import { Logger } from "../utils/logger.js";
import { v4 as uuidv4 } from "uuid";
import { deleteFromFirebase } from "../utils/delete.from.firebase.js";

const generatePaymentLink = async (transaction_details, doc_id) => {
  const { amount, name, mobile } = transaction_details;

  try {
    const transactionId = uuidv4();

    const data = {
      merchantId: process.env.MERCHANT_ID,
      merchantTransactionId: transactionId,
      name: name,
      amount: amount * 100, // Convert to smallest currency unit
      redirectUrl: `http://localhost:1250/api/v1/admission/verify-payment?id=${transactionId}&doc_id=${doc_id}`,
      redirectMode: "POST",
      mobileNumber: mobile,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const payloadMain = Buffer.from(JSON.stringify(data)).toString("base64");
    const string = payloadMain + "/pg/v1/pay" + process.env.SALT_KEY;
    const checksum =
      crypto.createHash("sha256").update(string).digest("hex") + "###1";

    console.log("Data to be sent:", data);
    console.log("Base64 Encoded Payload:", payloadMain);
    console.log("Generated Checksum (X-VERIFY):", checksum);

    const response = await axios.post(
      `${process.env.PG_TESTING_URL}/pay`,
      {
        request: payloadMain,
      },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
      }
    );

    return response.data?.data?.instrumentResponse?.redirectInfo?.url || null;
  } catch (error) {
    Logger(error, "error");
    return null;
  }
};

const submitAdmissionFrom = asyncHandler(async (req, res) => {
  try {
    const {
      student_details,
      parent_guardian_details,
      communication_address,
      other_details,
      bank_details,
      transaction_details,
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

    const paymentUrl = await generatePaymentLink(
      transaction_details,
      newAdmission._id
    );

    if (paymentUrl) {
      return res
        .status(201)
        .json(
          new ApiRes(
            201,
            { paymentUrl },
            "Admission form submitted successfully."
          )
        );
    } else {
      return res
        .status(500)
        .json(
          new ApiRes(
            500,
            null,
            "An error occurred while connecting to PhonePe PG."
          )
        );
    }
  } catch (error) {
    Logger(error, "error");
    return res
      .status(500)
      .json(
        new ApiRes(500, null, "An error occurred while submitting the form.")
      );
  }
});

const updateApplication = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id || !mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing admission ID"));
  }

  try {
    const admission = await Admission.findById(id);

    if (!admission) {
      return res.status(404).json(new ApiRes(404, null, "Admission not found"));
    }

    const {
      student_details,
      parent_guardian_details,
      communication_address,
      other_details,
      bank_details,
    } = req.body;

    // Check if a new student photo is provided
    if (req.file) {
      const studentPhotoUrl = await uploadImageToFirebase(
        req.file.path,
        "student_images"
      );
      student_details.student_photo = studentPhotoUrl;

      // delete the previous photo from firebase storage
      const deleted = await deleteFromFirebase(
        admission.student_details.student_photo
      );

      if (!deleted) {
        Logger(
          "Failed to delete the previous photo from firebase storage",
          "error"
        );
      }
    }

    // Update the admission document
    admission.student_details = student_details;
    admission.parent_guardian_details = parent_guardian_details;
    admission.communication_address = communication_address;
    admission.other_details = other_details;
    admission.bank_details = bank_details;

    // Save the updated admission document
    await admission.save();

    return res
      .status(200)
      .json(new ApiRes(200, null, "Admission updated successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, "Internal server error"));
  }
});

const paymentVerification = asyncHandler(async (req, res) => {
  try {
    const { id: merchantTransactionId, doc_id: docId } = req.query;
    const merchantId = process.env.MERCHANT_ID;

    const string =
      `/pg/v1/status/${merchantId}/${merchantTransactionId}` +
      process.env.SALT_KEY;
    const checksum =
      crypto.createHash("sha256").update(string).digest("hex") + "###1";

    const options = {
      method: "GET",
      url: `${process.env.PG_TESTING_URL}/status/${merchantId}/${merchantTransactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": merchantId,
      },
    };

    const { data } = await axios(options);

    if (data.data.responseCode === "SUCCESS") {
      const application = await Admission.findById(docId);

      application.payment_status = "PAID";

      // Prepare tasks
      const receiptTask = generateAdmissionReceipt({
        applicationId: application._id.toString(),
        studentName: `${application.student_details.first_name} ${application.student_details.last_name}`,
        motherName: application.parent_guardian_details.mother_information.name,
        fatherName: application.parent_guardian_details.father_information.name,
        class: application.student_details.class,
        receivedAmount: "₹500", // fixed amount, might change later
        transactionId: data.data?.transactionId,
        amountInWords: "Five Hundred Rupees Only",
      });

      const emailTask = sendPaymentConfirmationEmail(
        application.parent_guardian_details.guardian_information.name,
        application.parent_guardian_details.guardian_information.email,
        application._id,
        await receiptTask // Await here since email depends on receipt.
      );

      const saveApplicationTask = application.save();

      // Execute all tasks concurrently
      await Promise.all([receiptTask, emailTask, saveApplicationTask]);

      return res.redirect("http://localhost:3001");
    }

    return res.redirect("http://localhost:1250/error");
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const getApplicationsBasedOnStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;

  if (!status) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing status"));
  }

  try {
    // Only retrieve necessary fields to optimize performance
    const applications = await Admission.find(
      {
        application_status: status,
        payment_status: "PAID",
      },
      {
        _id: 1,
        "student_details.first_name": 1,
        "student_details.last_name": 1,
        "student_details.gender": 1,
        "student_details.student_photo": 1,
        "student_details.date_of_birth": 1,
        "student_details.class": 1,
        "parent_guardian_details.guardian_information.name": 1,
        "parent_guardian_details.guardian_information.contact_no": 1,
        "communication_address.current_address.village": 1,
        "communication_address.current_address.post_office": 1,
        "communication_address.current_address.police_station": 1,
        "communication_address.current_address.postal_code": 1,
        application_status: 1,
      }
    );

    if (!applications) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "No applications found"));
    }

    const applicationsList = applications.map((application) => {
      const {
        _id: id,
        student_details: {
          first_name,
          last_name,
          gender,
          student_photo: photo,
          date_of_birth,
          class: studentClass,
        },
        parent_guardian_details: {
          guardian_information: { name: guardianName, contact_no: phone },
        },
        communication_address: {
          current_address: {
            village,
            post_office,
            police_station,
            postal_code,
          },
        },
        application_status: status,
      } = application;

      return {
        id,
        student_details: {
          name: `${first_name} ${last_name}`,
          gender,
          photo,
          date_of_birth,
          class: studentClass,
        },
        guardian_details: {
          name: guardianName,
          phone,
        },
        address: {
          village,
          post_office,
          police_station,
          postal_code,
        },
        status,
      };
    });

    return res
      .status(200)
      .json(
        new ApiRes(
          200,
          applicationsList,
          "Applications list fetched successfully."
        )
      );
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const archiveApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing application ID"));
  }
  try {
    await Admission.findByIdAndUpdate(id, { application_status: "ARCHIVED" });
    return res.status(200).json(new ApiRes(200, null, "Application archived"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const getApplicationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id || !mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing application ID"));
  }
  try {
    const application = await Admission.findById(id);

    if (!application) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Application not found"));
    }
    return res
      .status(200)
      .json(new ApiRes(200, application, "Application fetched successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const changeCounsellingStatus = asyncHandler(async (req, res) => {
  const { id, status } = req.query;
  if (!id || !mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing application ID"));
  }
  if (validateFields(req.query, ["status"], res) !== true) {
    return;
  }
  try {
    const application = await Admission.findById(id);

    if (!application) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Application not found"));
    }
    if (status === "APPROVED") {
      application.application_status = "APPROVED";
      application.counselling_status = "APPROVED";
      application.counselling_time = null;
      application.counselling_date = null;
    } else if (status === "ARCHIVED") {
      application.application_status = "ARCHIVED";
      application.counselling_status = "ARCHIVED";
      application.counselling_time = null;
      application.counselling_date = null;
    }

    await application.save();
    return res
      .status(200)
      .json(new ApiRes(200, null, "Counselling status updated"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const deleteAdmission = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id || !mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid or missing application ID"));
  }
  try {
    // delete data
    const application = await Admission.findById(id).select(
      "_id student_details"
    );

    if (!application) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Application not found"));
    }

    // delete from firebase
    const fileUrl = application.student_details.student_photo;

    const deleted = await deleteFromFirebase(fileUrl);

    if (!deleted) {
      return res
        .status(404)
        .json(
          new ApiRes(
            404,
            null,
            "Something went wrong while deleting student photo"
          )
        );
    }

    await Admission.findByIdAndDelete(id);

    return res
      .status(200)
      .json(new ApiRes(200, null, "Application deleted successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});
export {
  submitAdmissionFrom,
  paymentVerification,
  getApplicationsBasedOnStatus,
  archiveApplication,
  getApplicationById,
  changeCounsellingStatus,
  deleteAdmission,
  updateApplication,
};
