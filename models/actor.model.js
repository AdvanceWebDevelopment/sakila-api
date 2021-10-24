import db from "../utils/db.js";

const TABLE_NAME = "actor";
const FILM_ACTOR_TABLE_NAME = "film_actor";
const TABLE_ID = "actor_id";

export async function findAll() {
  return await db(TABLE_NAME);
}

export async function findById(id) {
  const list = await db(TABLE_NAME).where(TABLE_ID, id);
  if (list.length === 0) return null;

  return list[0];
}

export async function add(actor) {
  return await db(TABLE_NAME).insert(actor);
}

export async function del(id) {
  await db(FILM_ACTOR_TABLE_NAME).where(TABLE_ID, id).del();

  return await db(TABLE_NAME).where(TABLE_ID, id).del();
}

export async function patch(id, actor) {
  return await db(TABLE_NAME).where(TABLE_ID, id).update(actor);
}
