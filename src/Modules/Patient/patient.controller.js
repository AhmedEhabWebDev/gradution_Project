import { Patient } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/index.js";
import PDFDocument from 'pdfkit';


/**
 * @param {object} req
 * @param {object} res
 * @returns {object} return response { status, message, data }
 * @api {POST} /api/patients/addPatient Add a new patient
 * @description Add a new patient
 */

export const addPatient = async (req, res, next) => {
  const {
    username,
    nationalId,
    age ,
    gender,
    phone,
    address,
    weight,
    height,
    bloodType,
    specializedMedicalDepartment,
    diagnosis,
    habits,
    chronicDiseases,
    CaseDescription,
    needsSurgery,
    doctorName,
    doctorSpecialization,
    entryDate,
    treatments
  } = req.body;

    const patient = await Patient.findOne({ nationalId });

    if (patient) {
      return next(new ErrorClass("Patient already exists", 400, "Patient already exists"));
    }

    const doc = new PDFDocument();
    let buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(buffers);

      const newPatient = new Patient({
      username,
      nationalId,
      age ,
      gender,
      phone,
      address,
      weight,
      height,
      bloodType,
      specializedMedicalDepartment,
      diagnosis,
      habits,
      chronicDiseases,
      CaseDescription,
      needsSurgery,
      doctor: [
        {
          name: doctorName,
          specialization: doctorSpecialization,
        },
      ],
      entryDate,
      treatments,
      pdfFile: pdfBuffer
      });

      await newPatient.save();

      res.status(201).json({
        status: "success",
        message: "Patient added successfully, PDF stored in DB",
        data: newPatient,
      });
    });

    doc.fontSize(20).text('Patient Information', { underline: true });
    doc.moveDown();
    doc.fontSize(14);
    doc.text(`Username: ${username}`);
    doc.text(`Age: ${age}`);
    doc.text(`Phone: ${phone}`);
    doc.text(`Address: ${address}`);
    doc.text(`Diagnosis: ${diagnosis}`);
    doc.text(`Chronic Diseases: ${chronicDiseases}`);
    doc.text(`Entry Date: ${patient?.entryDate}`);
    doc.moveDown();
    doc.fontSize(20).text('Medical Information', { underline: true });
    doc.moveDown();
    doc.fontSize(14);
    doc.text(`Doctor Name: ${doctorName}`);
    doc.text(`Specialization: ${doctorSpecialization}`);

    doc.end();

};

/**
 * @param {object} req
 * @param {object} res
 * @returns {object} return PDF File
 * @api {GET} /api/patients/file Get File for patient
 * @description Get File for patient
 */

export const getPatientPdf = async (req, res, next) => {
  const { _id } = req.params;

    const patient = await Patient.findById(_id);

    if (!patient || !patient.pdfFile) {
      return next(new ErrorClass("PDF not found", 404, "No PDF available for this patient"));
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="patient_${_id}.pdf"`,
    });

    res.send(patient.pdfFile);
};

/**
 * @param {object} req
 * @param {object} res
 * @returns {object} return response { status, message, data }
 * @api {GET} /api/patients/      GET all patients
 * @description Get all patients
 */

export const getAllPatients = async (req, res, next) => {
  const { sort } = req.query;
  const patients = await Patient.find().sort({ [sort]: 1 }).select("-pdfFile");


  res.status(200).json({
    status: "success",
    message: "Patients fetched successfully",
    data: patients,
  });
}

/**
 * @param {object} req
 * @param {object} res
 * @returns {object} return response { status, message, data }
 * @api {GET} /api/patients/getById/:_id Get patient by id
 * @description Get patient by id
 */

export const getPatientById = async (req, res, next) => {
  const { _id } = req.params;
  const patient = await Patient.findById(_id).select("-pdfFile");
  if (!patient) {
    return next(new ErrorClass("Patient not found", 404, "Patient not found"));
  }
  res.status(200).json({
    status: "success",
    message: "Patient fetched successfully",
    data: patient,
  });
}

/**
 * @param {object} req
 * @param {object} res
 * @returns {object} return response { status, message, data }
 * @api {GET} /api/patients/getFilteredPatients Get filtered patients
 * @description Get filtered patients
 */

export const getFilteredPatients = async (req, res, next) => {
  const { username, entryDate, doctorName, specializedMedicalDepartment } = req.query;

  let filter = {};

  if (username) filter.username = username;
  if (entryDate) filter.entryDate = entryDate;
  if (doctorName) filter["doctor.name"] = doctorName;
  if (specializedMedicalDepartment) filter.specializedMedicalDepartment = specializedMedicalDepartment;

  const patients = await Patient.find(filter).select("-pdfFile");

  if (!patients) {
    return next(new ErrorClass("Patient not found", 404, "Patient not found"));
  }

  res.status(200).json({
    status: "success",
    message: "Patients fetched successfully",
    data: patients,
  });
}

/**
 * @param {object} req
 * @param {object} res
 * @returns {object} return response { status, message, data }
 * @api {PUT} /api/patients/update/:_id Update patient
 * @description Update patient
 */

export const updatePatient = async (req, res, next) => {
  const { _id } = req.params;
  const { 
    username,
    nationalId,
    age ,
    gender,
    phone,
    address,
    weight,
    height,
    bloodType,
    specializedMedicalDepartment,
    diagnosis,
    habits,
    chronicDiseases,
    CaseDescription,
    needsSurgery,
    doctorName,
    doctorSpecialization,
    entryDate
  } = req.body;

  const patient = await Patient.findByIdAndUpdate(_id, {
    username,
    nationalId,
    age ,
    gender,
    phone,
    address,
    weight,
    height,
    bloodType,
    specializedMedicalDepartment,
    diagnosis,
    habits,
    chronicDiseases,
    CaseDescription,
    needsSurgery,
    doctor: [
      {
        name: doctorName,
        specialization: doctorSpecialization,
      },
    ],
    entryDate
  });


  res.status(200).json({
    status: "success",
    message: "Patient updated successfully",
    data: patient,
  });
}

/**
 * @param {object} req
 * @param {object} res
 * @returns {object} return response { status, message, data }
 * @api {DELETE} /api/patients/delete/:_id Delete patient
 * @description Delete patient
 */

export const deletePatient = async (req, res, next) => {
  const { _id } = req.params;
  await Patient.findByIdAndDelete(_id);
  res.status(200).json({
    status: "success",
    message: "Patient deleted successfully",
  });
}