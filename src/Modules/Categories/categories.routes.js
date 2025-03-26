import { Router } from "express";
// controllers
import * as controller from "./categories.controller.js";
// middlewares
import * as Middlewares from "../../Middlewares/index.js";

const categoryRouter = Router();
const { errorHandler, auth, authorization } = Middlewares;

categoryRouter.post(
  "/create", 
  auth(), 
  authorization(["Admin"]), 
  errorHandler(controller.createCategory)
);

categoryRouter.get(
  "/get", 
  auth(), 
  authorization(["Admin"]), 
  errorHandler(controller.getCategory)
);

categoryRouter.put(
  "/update/:_id", 
  auth(), 
  authorization(["Admin"]), 
  errorHandler(controller.updateCategory)
);

categoryRouter.delete(
  "/delete/:_id", 
  auth(), 
  authorization(["Admin"]), 
  errorHandler(controller.deleteCategory)
);

categoryRouter.get(
  "/get-all", 
  auth(), 
  authorization(["Admin"]), 
  errorHandler(controller.getAllCategories)
);

export { categoryRouter };