import express from 'express';
import { readFile } from 'fs/promises';

import validate from '../middlewares/validate.mdw.js';
import * as filmModel from '../models/film.model.js';

// import { addFilm, delFilm, findAllFilms, findFilmById, patchFilm } from '../models/film.model.js';

const router = express.Router();
const schema = JSON.parse(await readFile(new URL('../schemas/film.json', import.meta.url)));

router.get('/', async function (req, res) {
  const list = await filmModel.findAll();
  res.json(list);
});

router.get('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const film = await filmModel.findById(id);
  if (film === null) {
    return res.status(204).end();
  }

  res.json(film);
});

router.post('/', validate(schema), async function (req, res) {
  const ret = await filmModel.add(req.body);
  const film = {
    film_id: ret[0],
    ...req.body
  }
  res.status(201).json(film);
});

router.delete('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const n = await filmModel.del(id);
  res.json({
    affected: n
  });
});

router.patch('/:id', async function (req, res) {
  const id = req.params.id || 0;
  let film = req.body;
  const n = await filmModel.patch(id, film);
  res.json({
    affected: n
  });
});

export default router;