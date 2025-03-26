import { Router } from "express";
// controllers
import * as controller from "./sub-categories.controller.js";
// middlewares
import * as Middlewares from "../../Middlewares/index.js";

const subCategoryRouter = Router(); 
const { errorHandler, auth, authorization } = Middlewares;

subCategoryRouter.post(
  "/create", 
  auth(), 
  authorization(["Admin"]), 
  errorHandler(controller.createSubCategory)
);

subCategoryRouter.put(
  "/update/:_id", 
  auth(), 
  authorization(["Admin"]), 
  errorHandler(controller.updateSubCategory)
);

subCategoryRouter.get(
  "/get", 
  auth(), 
  authorization(["Admin"]), 
  errorHandler(controller.getSubCategory)
);

subCategoryRouter.delete(
  "/delete/:_id", 
  auth(), 
  authorization(["Admin"]), 
  errorHandler(controller.deleteSubCategory)
);

subCategoryRouter.get(
  "/get-all", 
  auth(), 
  authorization(["Admin"]), 
  errorHandler(controller.getAllSubCategories)
)
export { subCategoryRouter };