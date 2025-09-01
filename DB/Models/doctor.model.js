import { hashSync } from "bcrypt";
import mongoose from "../global-setup.js";

const { Schema, model } = mongoose;

const doctorSchema = new Schema(
  {
    doctorname: {
      type: String,
      required: true,
      trim: true,
    },
    nationalId: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age : {
      type: Number,
      required: true
    },
    gender : {
      type: String,
      enum: ["male", "female"],
    },
    phone: {
      type: String,
      required: true
    },
    specialization: {
      type: String,
      required: true
    },
    medicalDepartment: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

export const Doctor = 
  mongoose.models.Doctor || model("Doctor", doctorSchema);