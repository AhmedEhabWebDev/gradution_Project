import express from "express";
import { config } from "dotenv";

import { globaleResponse } from "./src/Middlewares/index.js";
import db_connection from "./DB/connection.js";
import * as router from "./src/Modules/index.js";
import cors from "cors";

config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/users", router.userRouter);
app.use("/api/patients", router.patientRouter);
app.use("/api/referrals", router.referralRouter);
app.use("/api/doctors", router.doctorRouter);

app.use("*", (req, res,next) => 
  res.status(404).json({massage:"Route Not Found"})
);

app.use(globaleResponse);

db_connection();


app.get("/", (req, res) => res.send("Hello World!"));
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// WbnJ2MjjoG1Q0Lb2