import express from "express";
import { readFile } from "fs/promises";
import validate from "../middlewares/validate.mdw.js";
import * as actorModel from "../models/actor.model.js";

const schema = JSON.parse(await readFile(new URL("../schemas/actor.json", import.meta.url)));

const router = express.Router();

router.get("/", async function (req, res) {
  const list = await actorModel.findAll();
  res.json(list);
});

router.get("/:id", async function (req, res) {
  const id = req.params.id || 0;
  const category = await actorModel.findById(id);
  if (category === null) {
    return res.status(204).end();
  }

  res.json(category);
});

router.post("/", validate(schema), async function (req, res) {
  let actor = req.body;
  const result = await actorModel.add(actor);

  actor = {
    actor_id: result[0],
    ...actor,
  };
  res.status(201).json(actor);
});

router.delete("/:id", async function (req, res) {
  const id = req.params.id || 0;
  const n = await actorModel.del(id);
  res.json({
    affected: n,
  });
});

router.patch("/:id", async function (req, res) {
  const id = req.params.id || 0;
  let actor = req.body;
  const n = await actorModel.patch(id, actor);
  res.json({
    affected: n,
  });
});

export default router;
