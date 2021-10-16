import express from "express";
import morgan from "morgan";
import asyncError from "express-async-errors";

import filmRouter from "./routes/film.route.js";
import categoryRouter from "./routes/category.route.js";
import actorRouter from "./routes/actor.route.js";
import customerRouter from "./routes/customer.route.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Sakila API is listening at http://localhost:${PORT}`);
});
