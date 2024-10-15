import { Admission } from "../models/admission.model.js";
import crypto from "crypto";
import axios from "axios";
import { ApiRes } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";
import { uploadImageToFirebase } from "../utils/upload.images.firebase.js";

const generatePaymentLink = async (transaction_details, doc_id) => {
  const { MUID, transactionId, amount, name, mobile } = transaction_details;

  try {
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
    console.error("Error generating payment link:", error);
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
    console.error("Error submitting admission form:", error);
    return res
      .status(500)
      .json(
        new ApiRes(500, null, "An error occurred while submitting the form.")
      );
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

    if (data?.success === true) {
      await Admission.findByIdAndUpdate(docId, { payment_status: "PAID" });
      return res.redirect("http://localhost:1250/success");
    }

    return res.redirect("http://localhost:1250/error");
  } catch (error) {
    console.error("Payment verification failed:", error);
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const getApplicationsBasedOnStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  try {
    const pendingApplications = await Admission.find({
      application_status: status,
      payment_status: "PAID",
    });

    return res.status(200).json(new ApiRes(200, { pendingApplications }));
  } catch (error) {
    console.error("Error getting pending applications:", error);
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const archiveApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await Admission.findByIdAndUpdate(id, { application_status: "ARCHIVED" });
    return res.status(200).json(new ApiRes(200, null, "Application archived"));
  } catch (error) {
    console.error("Error archiving application:", error);
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});
export {
  submitAdmissionFrom,
  paymentVerification,
  getApplicationsBasedOnStatus,
  archiveApplication,
};
