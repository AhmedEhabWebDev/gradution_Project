import mongoose from "../global-setup.js";


const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
  content : {
    type : String,
    require : true,
    trim : true
  },
  createdBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    require : true
  },
  propertyId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Property",
    require : true
  }
  },
  {
    timestamps : true
  }
);

export const Comment = mongoose.models.Comment || model("Comment", commentSchema);
