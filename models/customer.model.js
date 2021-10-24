import db from "../utils/db.js";

const TABLE_NAME = "customer";
const PAYMENT_TABLE_NAME = "payment";
const RENTAL_TABLE_NAME = "rental";
const TABLE_ID = "customer_id";

export async function findAll() {
  return await db(TABLE_NAME);
}

export async function findById(id) {
  const list = await db(TABLE_NAME).where(TABLE_ID, id);
  if (list.length === 0) return null;

  return list[0];
}

export async function add(customer) {
  return await db(TABLE_NAME).insert(customer);
}

export async function del(id) {
  Promise.all([
    await db(PAYMENT_TABLE_NAME).where(TABLE_ID, id).del(),
    await db(RENTAL_TABLE_NAME).where(TABLE_ID, id).del(),
  ]);
  return await db(TABLE_NAME).where(TABLE_ID, id).del();
}

export async function patch(id, customer) {
  return await db(TABLE_NAME).where(TABLE_ID, id).update(customer);
}
