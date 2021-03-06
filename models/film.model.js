import db from '../utils/db.js';

const TABLE_NAME = 'film';
const TABLE_ID = 'film_id';

export function findAll() {
  return db(TABLE_NAME);
}

export async function findById(id) {
  const list = await db(TABLE_NAME).where(TABLE_ID, id);
  if (list.length === 0)
    return null;

  return list[0];
}

export function add(film) {
  return db(TABLE_NAME).insert(film);
}

export function del(id) {
  return db(TABLE_NAME)
    .where(TABLE_ID, id)
    .del();
}

export function patch(id, film) {
  return db(TABLE_NAME)
    .where(TABLE_ID, id)
    .update(film);
}