import { Doctor } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/index.js";

export const addDoctor = async (req, res, next) => {
  const { 
    doctorname, 
    nationalId, 
    email, 
    age, 
    gender,
    phone,
    specialization,
    medicalDepartment 
  } = req.body;

  const isNationalExist = await Doctor.findOne({ nationalId });

  if (isNationalExist) {
    return next(new ErrorClass("National ID already exist", 400, "National ID already exist"));
  };
  
  const isEmailExist = await Doctor.findOne({ email });

  if (isEmailExist) {
    return next(new ErrorClass("Email already exist", 400, "Email already exist"));
  };

  const doctor = new Doctor({ 
    doctorname, 
    nationalId, 
    email, 
    age, 
    gender,
    phone,
    specialization,
    medicalDepartment 
  });

  await doctor.save();

  res.status(201).json({
    status: "success",
    message: "Doctor created successfully",
    data: doctor,
  });
}

export const getDoctorById = async (req, res, next) => {
  const { _id } = req.params;

  const doctor = await Doctor.findById(_id);

  if (!doctor) {
    return next(new ErrorClass("Doctor not found", 404, "Doctor not found"));
  }
  
  res.status(200).json({
    status: "success",
    message: "Doctor fetched successfully",
    data: doctor,
  });
}

export const getDoctors = async (req, res, next) => {
  const doctors = await Doctor.find();
  res.status(200).json({
    status: "success",
    message: "Doctors fetched successfully",
    data: doctors,
  });
};