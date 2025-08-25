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
    entryDate
  } = req.body;

    const patient = await Patient.findOne({nationalId});

    if (patient) {
      return next(new ErrorClass("Patient already exist", 400, "Patient already exist"));
    }

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
      entryDate
    });

    await newPatient.save();

    res.status(200).json({
      status: "success",
      message: "Patient added successfully",
      data: newPatient,
    });
}

export const createFile = async (req, res, next) => {
  const { _id } = req.params;

  const patient = await Patient.findById(_id);

  if (!patient) {
    return next(new ErrorClass("Patient not found", 404, "Patient not found"));
  }

   const doc = new PDFDocument();
    let buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(buffers);

      patient.pdfFile = pdfBuffer;
      await patient.save();

      res.status(200).json({
        status: "success",
        message: "PDF stored in DB",
        data: patient,
      });
    });

    // محتوى الـ PDF
    doc.fontSize(20).text('Patient Information', { underline: true });
    doc.moveDown();
    doc.fontSize(14);
    doc.text(`Username: ${patient.username}`);
    doc.text(`National ID: ${patient.nationalId}`);
    doc.text(`Gender: ${patient.gender}`);
    doc.text(`Age: ${patient.age}`);
    doc.text(`Phone: ${patient.phone}`);
    doc.text(`Address: ${patient.address}`);
    doc.text(`Diagnosis: ${patient.diagnosis}`);
    doc.text(`Entry Date: ${patient.entryDate}`);
    doc.text(`Case Description: ${patient.caseDescription}`);
    doc.text(`Chronic Diseases: ${patient.chronicDiseases}`);
    doc.moveDown();
    doc.fontSize(20).text('Doctor Information', { underline: true });
    doc.fontSize(14);
    doc.text(`Doctor Name: ${patient.doctor[0].name}`);
    doc.text(`Specialization: ${patient.doctor[0].specialization}`);

    doc.end();

}

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

export const getAllPatients = async (req, res, next) => {
  const { sort } = req.query;
  const patients = await Patient.find().sort({ [sort]: 1 }).select("-pdfFile");


  res.status(200).json({
    status: "success",
    message: "Patients fetched successfully",
    data: patients,
  });
}

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

export const deletePatient = async (req, res, next) => {
  const { _id } = req.params;
  await Patient.findByIdAndDelete(_id);
  res.status(200).json({
    status: "success",
    message: "Patient deleted successfully",
  });
}