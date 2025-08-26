import mongoose from "../global-setup.js";

const { Schema, model } = mongoose;

const referralSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    referralToSection: {
      type: String,
      required: true,
    },
    reasonForReferral: {
      type: String,
      required: true,
    },
    referralTo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


export const Referral = 
  mongoose.models.Referral || model("Referral", referralSchema);