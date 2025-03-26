import { hashSync } from "bcrypt";
import mongoose from "../global-setup.js";
import { Gender, UserType } from "../../src/Utils/index.js";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
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
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: Object.values(UserType),
    },
    age : {
      type: Number,
      required: true
    },
    gender : {
      type: String,
      enum: Object.values(Gender)
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = hashSync(this.password, +process.env.SALT_ROUNDS);
    next();
  };
});

export const User = 
  mongoose.models.User || model("User", userSchema);