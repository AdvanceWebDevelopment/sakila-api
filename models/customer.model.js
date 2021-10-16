import db from "../utils/db.js";

const TABLE_NAME = "customer";
const TABLE_ID = "customer_id";

export function findAll() {
  return db(TABLE_NAME);
}

export async function findById(id) {
  const list = await db(TABLE_NAME).where(TABLE_ID, id);
  if (list.length === 0) return null;

  return list[0];
}

export function add(customer) {
  return db(TABLE_NAME).insert(customer);
}

export function del(id) {
  return db(TABLE_NAME).where(TABLE_ID, id).del();
}

export function patch(id, customer) {
  return db(TABLE_NAME).where(TABLE_ID, id).update(customer);
}
