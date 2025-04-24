import { Router } from "express";
// controllers
import * as controller from "./cart.controller.js";
// middlewares
import * as Middlewares from "../../Middlewares/index.js";

const cartRouter = Router();
const { errorHandler, auth } = Middlewares;

cartRouter.post(
  "/add/:propertyId",
  auth(),
  errorHandler(controller.addToCart)
);

cartRouter.get(
  "/get",
  auth(),
  errorHandler(controller.getCart)
);

cartRouter.delete(
  "/remove/:propertyId",
  auth(),
  errorHandler(controller.removeFromCart)
);

export { cartRouter };