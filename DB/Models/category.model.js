import mongoose from "../global-setup.js";

const {Schema, model} = mongoose

const categorySchema = new Schema (
  {
    name : {
      type : String,
      require: true,
      trim: true
    },
    slug : {
      type : String,
      require : true,
      trim : true
    },
    createdBy : {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User",
      require: true
    }
  },
  {
    timestamps : true
  }
)

export const Category = 
  mongoose.models.Category || model("Category", categorySchema)