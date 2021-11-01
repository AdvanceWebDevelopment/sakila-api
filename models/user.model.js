import db from "../utils/db.js";

const TABLE_NAME = "user";
const TABLE_ID = "user_id";

export async function findAll() {
  return await db(TABLE_NAME);
}

export async function findById(id) {
  const list = await db(TABLE_NAME).where(TABLE_ID, id);
  if (list.length === 0) return null;

  return list[0];
}

export async function findByUsername(username) {
  const list = await db(TABLE_NAME).where("username", username);
  if (list.length === 0) return null;

  return list[0];
}

export async function add(data) {
  return await db(TABLE_NAME).insert(data);
}

export async function del(id) {
  return await db(TABLE_NAME).where(TABLE_ID, id).del();
}

export async function patch(id, actor) {
  return await db(TABLE_NAME).where(TABLE_ID, id).update(actor);
}

export async function updateRefreshToken(id, refreshToken) {
  return await db(TABLE_NAME).where(TABLE_ID, id).update({ refresh_token: refreshToken });
}

export async function findByRefreshToken(refreshToken) {
  const list = await db(TABLE_NAME).where("refresh_token", refreshToken);
  if (list.length === 0) return null;

  return list[0];
}
