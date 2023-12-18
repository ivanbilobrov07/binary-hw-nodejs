import cors from "cors";
import express from "express";
import { initRoutes } from "./routes/routes.js";

import "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initRoutes(app);

app.use("/", express.static("./client/build"));

app.use(({ status = 500, message }, req, res, next) => {
  res.status(status).json({
    error: true,
    message,
  });
});

const port = 3080;
app.listen(port, () => {});

export { app };
