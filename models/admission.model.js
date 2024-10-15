import { Schema, model } from "mongoose";

// Subschema for personal details
const personalDetailsSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  class: { type: String, required: true },
  gender: { type: String, required: true },
  religion: { type: String, required: true },
  caste: { type: String, required: true },
  hobbies: { type: String, default: "N/A" },
  talent: { type: String, default: "N/A" },
  student_photo: { type: String, required: true },
});

// Subschema for contact information
const contactInfoSchema = new Schema({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  contact_no: { type: String, required: true },
});

// Subschema for guardian details
const guardianInfoSchema = new Schema({
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  contact_no: { type: String, required: true },
  whatsapp_no: { type: String },
  email: { type: String, required: true },
  qualification: { type: String },
  occupation: { type: String, required: true },
  annual_income: { type: String, required: true },
});

// Subschema for address details
const addressSchema = new Schema({
  country: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  village: { type: String, required: true },
  post_office: { type: String, required: true },
  police_station: { type: String, required: true },
  postal_code: { type: String, required: true },
});

// Subschema for medical details
const medicalDetailsSchema = new Schema({
  blood_group: { type: String, required: true },
  allergies: {
    status: { type: Boolean, default: false },
    details: { type: String, default: "N/A" },
  },
  special_medical_conditions: {
    status: { type: Boolean, default: false },
    details: { type: String, default: "N/A" },
  },
  regular_medication: {
    status: { type: Boolean, default: false },
    details: { type: String, default: "N/A" },
  },
  special_assistance: {
    status: { type: Boolean, default: false },
    details: { type: String, default: "N/A" },
  },
  height: { type: String, required: true },
  weight: { type: String, required: true },
});

// Subschema for previous institution details
const previousInstituteSchema = new Schema({
  institute_name: { type: String, default: "N/A" },
  board_affiliation: { type: String, default: "N/A" },
  previous_class: { type: String, default: "N/A" },
  tc_submitted: { type: Boolean, default: false },
});

// Subschema for bank details
const bankDetailsSchema = new Schema({
  account_holder_name: { type: String, required: true },
  bank_name: { type: String, required: true },
  account_no: { type: String, required: true },
  ifsc_code: { type: String, required: true },
});

// Main admission schema
const admissionSchema = new Schema(
  {
    student_details: personalDetailsSchema,
    parent_guardian_details: {
      father_information: contactInfoSchema,
      mother_information: contactInfoSchema,
      guardian_information: guardianInfoSchema,
    },
    communication_address: {
      current_address: addressSchema,
      permanent_address: addressSchema,
    },
    other_details: {
      previous_institute_details: previousInstituteSchema,
      medical_details: medicalDetailsSchema,
    },
    bank_details: bankDetailsSchema,
    payment_status: {
      type: String,
      enum: ["PAID", "UNPAID"],
      default: "UNPAID",
    },
    application_status: {
      type: String,
      enum: ["PENDING", "UNDER-COUNSELLING", "APPROVED", "ARCHIVED"],
      default: "PENDING",
    },
    counselling_status: {
      type: String,
      enum: ["PENDING", "APPROVED", "ARCHIVED"],
      default: "PENDING",
    },
    counselling_time: {
      type: String,
      default: null,
    },
    counselling_date: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const Admission = model("Admission", admissionSchema);
