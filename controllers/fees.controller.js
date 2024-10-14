import { FeesHeader, FeesGroup } from "../models/fees.model.js";
import { ApiRes } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";

const createFeesHeader = asyncHandler(async (req, res) => {
  try {
    const { name, feesCode, occurance, dueDate, amount, description } =
      req.body;

    if (!name || !feesCode || !occurance || !dueDate) {
      return res
        .status(400)
        .json(new ApiRes(400, null, "All fields are required"));
    }

    const existingFeesHeader = await FeesHeader.findOne({ name, feesCode });

    if (existingFeesHeader) {
      return res
        .status(400)
        .json(new ApiRes(400, null, "Fees header already exists"));
    }

    const newFeesHeader = new FeesHeader({
      name,
      feesCode,
      occurance,
      dueDate,
      amount,
      description,
    });

    await newFeesHeader.save();

    return res
      .status(201)
      .json(new ApiRes(201, newFeesHeader, "Fees header created successfully"));
  } catch (error) {
    console.error("Error creating fees header:", error);
    return res
      .status(500)
      .json(
        new ApiRes(500, null, "An error occurred while creating fees header")
      );
  }
});

const createFeesGroup = asyncHandler(async (req, res) => {
  try {
    const { name, feesHeaders } = req.body;

    if (!name) {
      return res.status(400).json(new ApiRes(400, null, "Name is required"));
    }

    const existingFeesGroup = await FeesGroup.findOne({ name });

    if (existingFeesGroup) {
      return res
        .status(400)
        .json(new ApiRes(400, null, "Fees group already exists"));
    }

    const newFeesGroup = new FeesGroup({
      name,
      feesHeaders,
    });

    await newFeesGroup.save();

    return res
      .status(201)
      .json(new ApiRes(201, newFeesGroup, "Fees group created successfully"));
  } catch (error) {
    console.error("Error creating fees group:", error);
    return res
      .status(500)
      .json(
        new ApiRes(500, null, "An error occurred while creating fees group")
      );
  }
});

const updateFeesGroup = asyncHandler(async (req, res) => {
  const { feesGroupID, feesHeaders } = req.body;

  if (feesHeaders.length === 0) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Atleast one fees header is required"));
  }

  try {
    const feesGroup = await FeesGroup.findById(feesGroupID);

    if (!feesGroup) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Fees group not found"));
    }

    const existingFeesHeaders = feesGroup.feesHeaders;

    feesHeaders.forEach((feesHeader) => {
      if (!existingFeesHeaders.includes(feesHeader)) {
        existingFeesHeaders.push(feesHeader);
      }
    });

    feesGroup.feesHeaders = existingFeesHeaders;
    await feesGroup.save();

    return res
      .status(200)
      .json(new ApiRes(200, feesGroup, "Fees group updated successfully"));
  } catch (error) {
    console.error("Error updating fees group:", error);
    return res
      .status(500)
      .json(
        new ApiRes(500, null, "An error occurred while updating fees group")
      );
  }
});

export { createFeesHeader, createFeesGroup, updateFeesGroup };
