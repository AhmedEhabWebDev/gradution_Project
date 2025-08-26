import { Router } from "express";
// controllers
import * as controller from "./referral.controller.js";
// middlewares
import * as Middlewares from "../../Middlewares/index.js";

const referralRouter = Router();
const { errorHandler } = Middlewares;

referralRouter.post("/createReferralModel/:patientId", errorHandler(controller.createReferralModel));

referralRouter.get("/getReferrals", errorHandler(controller.getReferrals));

referralRouter.get("/getReferralById/:_id", errorHandler(controller.getReferralById));
export { referralRouter };