import { Router } from "express";
// controllers
import * as controller from "./user.controller.js";
// middlewares
import * as Middlewares from "../../Middlewares/index.js";

const userRouter = Router();
const { errorHandler } = Middlewares;

userRouter.post("/register", errorHandler(controller.registerUser));

userRouter.post("/signin", errorHandler(controller.signIn));

userRouter.put("/update/:_id", errorHandler(controller.updateUser));

userRouter.patch("/updatePassword/:_id", errorHandler(controller.updatePassword))

userRouter.delete("/delete/:_id", errorHandler(controller.deleteUser));

export { userRouter };