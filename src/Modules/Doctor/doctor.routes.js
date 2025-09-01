import { Router } from "express";
// controllers
import * as controller from "./doctor.controller.js";
// middlewares
import * as Middlewares from "../../Middlewares/index.js";

const doctorRouter = Router();
const { errorHandler } = Middlewares;

doctorRouter.post("/addDoctor", errorHandler(controller.addDoctor));

doctorRouter.get("/getById/:_id", errorHandler(controller.getDoctorById));

doctorRouter.get("/getAllDoctors", errorHandler(controller.getDoctors));

export { doctorRouter };