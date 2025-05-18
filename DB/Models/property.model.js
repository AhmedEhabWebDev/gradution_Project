import mongoose from "../global-setup.js";

const { Schema, model } = mongoose;

const propertySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    rooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    images: {
      URLs: [
        {
          secure_url: {
            type: String,
            required: true,
          },
          public_id: {
            type: String,
            required: true,
            unique: true,
          },
        },
      ],
      customId: {
        type: String,
        required: true,
        unique: true,
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Sold"],
      default: "Available",
    },
    purpose: {
      type: String,
      enum: ["Rent", "Sale"],
      required: true,
    },
    availabFrom: {
      type: Date,
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mapLink: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

propertySchema.index({ location: "2dsphere" });

export const Property = 
  mongoose.models.Property || model("Property", propertySchema);