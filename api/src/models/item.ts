import { executeQuery } from '../lib/db';

interface TodoItem {
  id: number;
  userId: number;
  text: string;
  isComplete: boolean;
  createdAt: number;
  updatedAt: number;
}

/**
 * Create a TodoItem
 *
 * @param userId
 * @param text
 *
 */
async function create(userId: number, text: string): Promise<TodoItem> {
  const insertQuery = `
    INSERT INTO TodoItem
      (userId, text)
    VALUES
      (?, ?)
  `;

  const selectQuery = `
    SELECT
      id, userId, text, isComplete, UNIX_TIMESTAMP(createdAt) AS createdAt, UNIX_TIMESTAMP(updatedAt) AS updatedAt
    FROM
      TodoItem
    WHERE
      id = ?
  `;

  const insertParams = [userId, text];

  const insertResult = await executeQuery(insertQuery, insertParams);

  const rows = await executeQuery(selectQuery, [insertResult.insertId]);

  if (rows.length !== 1) {
    // TODO: throw Error
  }

  return rows[0];
}

async function update() {}

export default {
  create,
  update,
};
