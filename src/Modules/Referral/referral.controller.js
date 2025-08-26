import { Patient, Referral } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/index.js";

export const createReferralModel = async (req, res, next) => {
  const { referralToSection, reasonForReferral, referralTo } = req.body;
  const { patientId: _id } = req.params;

  const patient = await Patient.findById(_id);
  if (!patient) {
    return next(new ErrorClass("Patient not found", 404, "Patient not found"));
  }

  const referral = new Referral({
    patient: _id,
    referralToSection,
    reasonForReferral,
    referralTo,
  });

  await referral.save();

  res.status(201).json({
    status: "success",
    message: "Referral created successfully",
    data: referral,
  });
}

export const getReferrals = async (req, res, next) => {
  const referrals = await Referral.find().populate("patient", "username age");
  res.status(200).json({
    status: "success",
    message: "Referrals fetched successfully",
    data: referrals,
  });
}

export const getReferralById = async (req, res, next) => {
  const { _id } = req.params;
  const referral = await Referral.findById(_id).populate("patient", "username age");
  if (!referral) {
    return next(new ErrorClass("Referral not found", 404, "Referral not found"));
  }
  res.status(200).json({
    status: "success",
    message: "Referral fetched successfully",
    data: referral,
  });
}