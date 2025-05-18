import { Router } from "express";
// controllers
import * as controller from "./properties.controller.js";
// middlewares 
import * as Middlewares from "../../Middlewares/index.js";
// Utils
import { extensions } from "../../Utils/index.js";

const propertyRouter = Router();

const { 
  errorHandler, 
  auth, 
  authorization, 
  multerHost
 } = Middlewares;

// Properties Routes

propertyRouter.post(
  "/add",
  multerHost({ allowedExtensions: extensions.Images }).array("images", 5),
  auth(),
  authorization(["Admin", "Seller"]),
  errorHandler(controller.addProperty)
);

propertyRouter.put(
  "/update/:propertyId",
  auth(),
  authorization(["Admin", "Seller"]),
  errorHandler(controller.updateProperty)
);

propertyRouter.delete(
  "/delete/:propertyId",
  auth(),
  authorization(["Admin", "Seller"]),
  errorHandler(controller.deleteProperty)
);

propertyRouter.get(
  "/get-notApproved-properties",
  auth(),
  authorization(["Admin"]),
  errorHandler(controller.notApprovedProperties)
)

propertyRouter.patch(
  "/approve/:propertyId",
  auth(),
  authorization(["Admin"]),
  errorHandler(controller.approvedProperty)
)

propertyRouter.get(
  "/list",
  auth(),
  errorHandler(controller.propertyList)
);

propertyRouter.get(
  "/get-all-for-admin",
  auth(),
  authorization(["Admin"]),
  errorHandler(controller.getAllProperties)
);

propertyRouter.get(
  "/my-properties",
  auth(),
  errorHandler(controller.myProperties)
);

// Comments Routes

propertyRouter.post(
  "/:propertyId/add-comment",
  auth(),
  errorHandler(controller.addComment)
);

propertyRouter.get(
  "/:propertyId/comments",
  auth(),
  errorHandler(controller.getComments)
);

propertyRouter.delete(
  "/:propertyId/comments/:commentId",
  auth(),
  errorHandler(controller.deleteComment)
);

propertyRouter.patch(
  "/:propertyId/comments/:commentId",
  auth(),
  errorHandler(controller.updateComment)
)
export { propertyRouter };