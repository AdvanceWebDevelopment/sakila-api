import express from "express";
import { readFile } from "fs/promises";

import validate from "../middlewares/validate.mdw.js";
import * as customerModel from "../models/customer.model.js";

const router = express.Router();
const schema = JSON.parse(
  await readFile(new URL("../schemas/customer.json", import.meta.url))
);

router.get("/", async function (req, res) {
  const list = await customerModel.findAll();
  res.json(list);
});

router.get("/:id", async function (req, res) {
  const id = req.params.id || 0;
  const film = await customerModel.findById(id);
  if (film === null) {
    return res.status(204).end();
  }

  res.json(film);
});

router.post("/", validate(schema), async function (req, res) {
  const ret = await customerModel.add(req.body);
  const film = {
    customer_id: ret[0],
    ...req.body,
  };
  res.status(201).json(film);
});

router.delete("/:id", async function (req, res) {
  const id = req.params.id || 0;
  const n = await customerModel.del(id);
  res.json({
    affected: n,
  });
});

router.patch("/:id", async function (req, res) {
  const id = req.params.id || 0;
  let film = req.body;
  const n = await customerModel.patch(id, film);
  res.json({
    affected: n,
  });
});

export default router;
