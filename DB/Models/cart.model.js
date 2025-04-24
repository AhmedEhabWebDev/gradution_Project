import mongoose from "../global-setup.js";

const {Schema, model} = mongoose;

const cartSchema = new Schema(
  {
    userId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User",
      require : true
    },
    properties : [
      {
        propertyId : {
          type : mongoose.Schema.Types.ObjectId,
          ref : "Property",
          require : true
        },
      }
    ],
  },
  {
    timestamps : true,
  }
);

export const Cart = mongoose.models.Cart || model("Cart", cartSchema);