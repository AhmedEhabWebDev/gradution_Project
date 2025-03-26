import { Router } from "express";
// controllers
import * as controller from "./user.controller.js";
// middlewares
import * as Middlewares from "../../Middlewares/index.js";

const userRouter = Router();
const { errorHandler, auth, authorization } = Middlewares;

userRouter.post("/register", errorHandler(controller.registerUser));

userRouter.post("/signin", errorHandler(controller.signIn));

userRouter.put("/update", auth(), errorHandler(controller.updateUser));

userRouter.patch("/updatePassword", auth(), errorHandler(controller.updatePassword))

userRouter.delete("/delete/:_id", auth(), authorization(["Admin"]), errorHandler(controller.deleteUser));
export { userRouter };