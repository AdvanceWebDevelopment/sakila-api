import express from "express";
import { readFile } from "fs/promises";

import * as categoryModel from "../models/category.model.js";
import validate from "../middlewares/validate.mdw.js";

const router = express.Router();
const schema = JSON.parse(
  await readFile(new URL("../schemas/category.json", import.meta.url))
);

router.get("/", async function (req, res) {
  const list = await categoryModel.findAll();
  res.json(list);
});

router.get("/:id", async function (req, res) {
  const id = req.params.id || 0;
  const category = await categoryModel.findById(id);
  if (category === null) {
    return res.status(204).end();
  }

  res.json(category);
});

router.post("/", validate(schema), async function (req, res) {
  let category = req.body;
  const ret = await categoryModel.add(category);

  category = {
    category_id: ret[0],
    ...category,
  };
  res.status(201).json(category);
});

router.delete("/:id", async function (req, res) {
  const id = req.params.id || 0;
  const n = await categoryModel.del(id);
  res.json({
    affected: n,
  });
});

router.patch("/:id", async function (req, res) {
  const id = req.params.id || 0;
  let category = req.body;
  const n = await categoryModel.patch(id, category);
  res.json({
    affected: n,
  });
});

export default router;
