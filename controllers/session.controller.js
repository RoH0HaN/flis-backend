import { Session } from "../models/session.model.js";
import { ApiRes, validateFields } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";
import { Logger } from "../utils/logger.js";

const createSession = asyncHandler(async (req, res) => {
  const { year, startDate, endDate } = req.body;

  const requiredFields = ["year", "startDate", "endDate"];

  // Use the utility function
  if (validateFields(req.body, requiredFields, res) !== true) {
    return;
  }

  try {
    const previousSession = await Session.findOne({ isActive: true });

    if (previousSession) {
      previousSession.isActive = false;
      await previousSession.save();
    }
    const newSession = new Session({
      year,
      startDate,
      endDate,
    });

    await newSession.save();

    return res
      .status(201)
      .json(new ApiRes(201, newSession, "Session created successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const deleteSession = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Session ID is required"));
  }
  try {
    await Session.findByIdAndDelete(id);
    return res
      .status(200)
      .json(new ApiRes(200, null, "Session deleted successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const getAllSessions = asyncHandler(async (req, res) => {
  try {
    const sessions = await Session.find({}).select(
      "-__v -createdAt -updatedAt"
    );
    return res
      .status(200)
      .json(new ApiRes(200, sessions, "Sessions fetched successfully"));
  } catch (error) {
    Logger(error, "error");
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

export { createSession, deleteSession, getAllSessions };
