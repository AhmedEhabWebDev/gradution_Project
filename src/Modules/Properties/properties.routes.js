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

propertyRouter.get(
  "/get/:propertyId",
  auth(),
  errorHandler(controller.getProperty)
);

propertyRouter.get(
  "/get-all",
  errorHandler(controller.getProperties)
);

propertyRouter.delete(
  "/delete/:propertyId",
  auth(),
  authorization(["Admin", "Seller"]),
  errorHandler(controller.deleteProperty)
);

propertyRouter.get(
  "/get-by-category/:categoryId",
  auth(),
  errorHandler(controller.getPropertyByCategory)
);

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