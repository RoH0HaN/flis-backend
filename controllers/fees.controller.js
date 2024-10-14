import { FeesHeader, FeesGroup, FeesMaster } from "../models/fees.model.js";
import { ApiRes } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";

const createFeesHeader = asyncHandler(async (req, res) => {
  try {
    const { name, feesCode, occurance, dueDate, description } = req.body;

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
    const { name, groupCode } = req.body;

    if (!name || !groupCode) {
      return res
        .status(400)
        .json(new ApiRes(400, null, "Name and group code is required"));
    }

    const existingFeesGroup = await FeesGroup.findOne({ name, groupCode });

    if (existingFeesGroup) {
      return res
        .status(400)
        .json(new ApiRes(400, null, "Fees group already exists"));
    }

    const newFeesGroup = new FeesGroup({
      name,
      groupCode,
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

const createFeesMaster = asyncHandler(async (req, res) => {
  try {
    const { group, headers } = req.body;

    if (!group || headers.length === 0) {
      return res
        .status(400)
        .json(new ApiRes(400, null, "Group and headers are required"));
    }

    if (headers.some((item) => !item.header)) {
      return res.status(400).json(new ApiRes(400, null, "Header is required"));
    }

    const newFeesMaster = new FeesMaster({
      group,
      headers,
    });

    await newFeesMaster.save();

    return res
      .status(201)
      .json(new ApiRes(201, newFeesMaster, "Fees master created successfully"));
  } catch (error) {
    console.error("Error creating fees master:", error);
    return res
      .status(500)
      .json(
        new ApiRes(500, null, "An error occurred while creating fees master")
      );
  }
});

const setAmount = asyncHandler(async (req, res) => {
  const { master_id, obj_id, amount } = req.body;

  if (!master_id || !obj_id || !amount) {
    return res
      .status(400)
      .json(
        new ApiRes(400, null, "Master id, object id and amount are required")
      );
  }

  try {
    const master = await FeesMaster.findById(master_id);

    if (!master) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Fees master not found"));
    }

    const obj = master.headers.find((item) => item._id.toString() === obj_id);

    if (!obj) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Header object not found"));
    }

    obj.amount = amount;

    await master.save();

    return res
      .status(200)
      .json(new ApiRes(200, master, "Fees master updated successfully"));
  } catch (error) {
    console.error("Error creating fees master:", error);
    return res
      .status(500)
      .json(
        new ApiRes(500, null, "An error occurred while creating fees master")
      );
  }
});

const deleteHeaderInMaster = asyncHandler(async (req, res) => {
  const { master_id, obj_id } = req.body;

  if (!master_id || !obj_id) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Master id and object id are required"));
  }

  try {
    const master = await FeesMaster.findById(master_id);

    if (!master) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Fees master not found"));
    }

    master.headers = master.headers.filter(
      (item) => item._id.toString() !== obj_id
    );

    await master.save();

    return res
      .status(200)
      .json(new ApiRes(200, null, "Header object deleted successfully"));
  } catch (error) {
    console.error("Error creating fees master:", error);
    return res
      .status(500)
      .json(
        new ApiRes(500, null, "An error occurred while creating fees master")
      );
  }
});

const addHeaderToMaster = asyncHandler(async (req, res) => {
  const { master_id, headers } = req.body;

  if (!master_id || headers.length === 0) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Master id and headers are required"));
  }

  try {
    const master = await FeesMaster.findById(master_id);

    if (!master) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Fees master not found"));
    }

    headers.forEach((header) => {
      master.headers.push({ header, amount: 0 });
    });

    await master.save();

    return res
      .status(200)
      .json(new ApiRes(200, master, "Fees master updated successfully"));
  } catch (error) {
    console.error("Error creating fees master:", error);
    return res
      .status(500)
      .json(
        new ApiRes(500, null, "An error occurred while creating fees master")
      );
  }
});

export {
  createFeesHeader,
  createFeesGroup,
  createFeesMaster,
  setAmount,
  deleteHeaderInMaster,
  addHeaderToMaster,
};
