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

app.use("/users", router.userRouter);
app.use("/categories", router.categoryRouter);
app.use("/sub-categories", router.subCategoryRouter)
app.use("/properties", router.propertyRouter);
app.use("/cart", router.cartRouter);

app.use("*", (req, res,next) => 
  res.status(404).json({massage:"Route Not Found"})
);

app.use(globaleResponse);

db_connection();


app.get("/", (req, res) => res.send("Hello World!"));
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// WbnJ2MjjoG1Q0Lb2