import mongoose from "../global-setup.js";

const { Schema, model } = mongoose;

const patientSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    nationalId: {
      type: String,
      required: true,
    },
    age : {
      type: Number,
      required: true
    },
    gender : {
      type: String,
      enum: ["male", "female"],
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    bloodType: {
      type: String,
      required: true,
      enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]
    },
    specializedMedicalDepartment: {
      type: String,
      required: true
    },
    diagnosis: {
      type: String,
      required: true
    },
    habits: String,
    chronicDiseases: {
      type: String,
      required: true,
      enum: ["diabetes", "hypertension", "heartDisease", "none"]
    },
    CaseDescription: String,
    needsSurgery: {
      type: String,
      required: true,
      enum: ["yes", "no"]
    },
    doctor: [
      {
        name: {
          type: String,
          required: true
        },
        specialization: {
          type: String,
          required: true
        }
      }
    ],
    pdfFile: Buffer,
    entryDate: {
      type: Date,
      default: Date.now
    },
    treatments: String
  },
  {
    timestamps: true,
  }
);


export const Patient = 
  mongoose.models.Patient || model("Patient", patientSchema);