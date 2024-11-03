import axios from "axios";

async function sendCounsellingSms(
  guardianName,
  phone,
  studentName,
  counsellingDate,
  counsellingTime
) {
  const message = `Dear ${guardianName}, your ward ${studentName} has been scheduled for a counselling session on ${counsellingDate} at ${counsellingTime}. Please be present.`;

  const smsData = {
    message,
    language: "english",
    route: "q", // Check your Fast2SMS account for the correct route
    numbers: phone,
  };

  const config = {
    method: "POST",
    url: "https://www.fast2sms.com/dev/bulkV2",
    headers: {
      authorization: process.env.FAST2SMS_API_KEY, // Your Fast2SMS API key
      "Content-Type": "application/json",
    },
    data: smsData,
  };

  try {
    // const response = await axios(config);
    // console.log("SMS sent: ", response.data);
  } catch (error) {
    console.error("Error sending SMS: ", error);
    throw error;
  }
}

export { sendCounsellingSms };
