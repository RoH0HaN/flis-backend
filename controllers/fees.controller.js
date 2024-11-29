import { isValidObjectId } from "mongoose";
import { FeesHeader, FeesGroup, FeesMaster } from "../models/fees.model.js";
import { ApiRes } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";

const createFeesHeader = asyncHandler(async (req, res) => {
  try {
    const { name, feesCode, occurrence, dueDate, description } = req.body;

    if (!name || !feesCode || !occurrence || !dueDate) {
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
      occurrence,
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
    const { name, groupCode, description } = req.body;

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
      description,
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

    const existingFeesMaster = await FeesMaster.findOne({ group });

    if (existingFeesMaster) {
      return res
        .status(400)
        .json(
          new ApiRes(400, null, "Fees master already exists with this group")
        );
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
      master.headers.push({ header: header.header, amount: 0 });
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

const getAllHeaders = asyncHandler(async (req, res) => {
  try {
    const headers = await FeesHeader.find().select(
      "-__v -createdAt -updatedAt"
    );
    return res
      .status(200)
      .json(new ApiRes(200, headers, "Fees headers fetched successfully"));
  } catch (error) {
    console.error("Error fetching fees headers:", error);
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const getAllGroups = asyncHandler(async (req, res) => {
  try {
    const groups = await FeesGroup.find().select("-__v -createdAt -updatedAt");
    return res
      .status(200)
      .json(new ApiRes(200, groups, "Fees groups fetched successfully"));
  } catch (error) {
    console.error("Error fetching fees groups:", error);
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const getAllGroupsForDropdown = asyncHandler(async (req, res) => {
  try {
    const groups = await FeesGroup.find().select(
      "-__v -createdAt -updatedAt -groupCode -description"
    );
    return res
      .status(200)
      .json(new ApiRes(200, groups, "Fees groups fetched successfully"));
  } catch (error) {
    console.error("Error fetching fees groups:", error);
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const getAllMasters = asyncHandler(async (req, res) => {
  try {
    const masters = await FeesMaster.find().select(
      "-__v -createdAt -updatedAt"
    );
    return res
      .status(200)
      .json(new ApiRes(200, masters, "Fees masters fetched successfully"));
  } catch (error) {
    console.error("Error fetching fees masters:", error);
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const getHeaderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Fees header id is required"));
  }
  try {
    const header = await FeesHeader.findById(id).select(
      "-__v -createdAt -updatedAt"
    );

    if (!header) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Fees header not found"));
    }

    return res
      .status(200)
      .json(new ApiRes(200, header, "Fees header fetched successfully"));
  } catch (error) {
    console.error("Error fetching fees header:", error);
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const updateHeader = asyncHandler(async (req, res) => {
  const { id, name, feesCode, occurrence, dueDate, description } = req.body;

  if (
    !id ||
    !name ||
    !feesCode ||
    !occurrence ||
    !dueDate ||
    !isValidObjectId(id)
  ) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "All fields are required"));
  }
  try {
    const header = await FeesHeader.findByIdAndUpdate(id, {
      name,
      feesCode,
      occurrence,
      dueDate,
      description,
    }).select("-__v -createdAt -updatedAt");

    if (!header) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Fees header not found"));
    }

    return res
      .status(200)
      .json(new ApiRes(200, null, "Fees header updated successfully"));
  } catch (error) {
    console.error("Error updating fees header:", error);
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const deleteHeader = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Fees header id is required"));
  }
  try {
    const header = await FeesHeader.findByIdAndDelete(id).select(
      "-__v -createdAt -updatedAt"
    );

    if (!header) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Fees header not found"));
    }

    return res
      .status(200)
      .json(new ApiRes(200, null, "Fees header deleted successfully"));
  } catch (error) {
    console.error("Error deleting fees header:", error);
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const getGroupById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Fees group id is required"));
  }
  try {
    const group = await FeesGroup.findById(id).select(
      "-__v -createdAt -updatedAt"
    );

    if (!group) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Fees group not found"));
    }

    return res
      .status(200)
      .json(new ApiRes(200, group, "Fees group fetched successfully"));
  } catch (error) {
    console.error("Error fetching fees header:", error);
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const updateGroup = asyncHandler(async (req, res) => {
  const { id, name, groupCode, description } = req.body;

  if (!id || !name) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "All fields are required"));
  }
  try {
    const group = await FeesGroup.findByIdAndUpdate(id, {
      name,
      groupCode,
      description,
    }).select("-__v -createdAt -updatedAt");

    if (!group) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Fees group not found"));
    }

    return res
      .status(200)
      .json(new ApiRes(200, null, "Fees header updated successfully"));
  } catch (error) {
    console.error("Error updating fees header:", error);
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const deleteGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Fees header id is required"));
  }
  try {
    const group = await FeesGroup.findByIdAndDelete(id).select(
      "-__v -createdAt -updatedAt"
    );

    if (!group) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Fees group not found"));
    }

    return res
      .status(200)
      .json(new ApiRes(200, null, "Fees group deleted successfully"));
  } catch (error) {
    console.error("Error deleting fees header:", error);
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

const deleteMaster = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Fees master id is required"));
  }
  try {
    const master = await FeesMaster.findByIdAndDelete(id).select(
      "-__v -createdAt -updatedAt"
    );

    if (!master) {
      return res
        .status(404)
        .json(new ApiRes(404, null, "Fees master not found"));
    }

    return res
      .status(200)
      .json(new ApiRes(200, null, "Fees master deleted successfully"));
  } catch (error) {
    console.error("Error deleting fees master:", error);
    return res.status(500).json(new ApiRes(500, null, error.message));
  }
});

export {
  createFeesHeader,
  createFeesGroup,
  createFeesMaster,
  setAmount,
  deleteHeaderInMaster,
  addHeaderToMaster,
  getAllHeaders,
  getAllGroups,
  getAllGroupsForDropdown,
  getAllMasters,
  getHeaderById,
  updateHeader,
  deleteHeader,
  getGroupById,
  updateGroup,
  deleteGroup,
  deleteMaster,
};
