import express from "express";
import morgan from "morgan";
import cors from "cors";
import asyncError from "express-async-errors";

import { auth as authTokenMdw } from "./middlewares/auth.mdw.js";
import authRouter from "./routes/auth.route.js";
import filmRouter from "./routes/film.route.js";
import categoryRouter from "./routes/category.route.js";
import actorRouter from "./routes/actor.route.js";
import customerRouter from "./routes/customer.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth/", authRouter);
app.use(authTokenMdw);
app.use("/api/films/", filmRouter);
app.use("/api/categories/", categoryRouter);
app.use("/api/actors/", actorRouter);
app.use("/api/customers/", customerRouter);

app.get("/err", function (req, res) {
  throw new Error("Error!");
});

app.use(function (req, res, next) {
  res.status(404).json({
    error: "Endpoint not found",
  });
});

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).json({
    error: "Something broke!",
  });
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, function () {
  console.log(`Sakila API is listening at http://localhost:${PORT}`);
});
