import { Router } from "express";
// controllers
import * as controller from "./patient.controller.js";
// middlewares
import * as Middlewares from "../../Middlewares/index.js";

const patientRouter = Router();
const { errorHandler } = Middlewares;

patientRouter.post("/addPatient", errorHandler(controller.addPatient));

patientRouter.post("/createFile/:_id", errorHandler(controller.createFile));

patientRouter.get('/pdf/:_id', errorHandler(controller.getPatientPdf));

patientRouter.get("/", errorHandler(controller.getAllPatients));

patientRouter.get("/getById/:_id", errorHandler(controller.getPatientById));

patientRouter.put("/updatePatient/:_id", errorHandler(controller.updatePatient));

patientRouter.delete("/deletePatient/:_id", errorHandler(controller.deletePatient));

patientRouter.get("/getFilteredPatients", errorHandler(controller.getFilteredPatients));


export { patientRouter };