// pages/api/story/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL, // Set this in .env.local
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  await client.connect();

  try {
    const result = await client.query("SELECT * FROM stories WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Story not found" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    res.status(500).json({ error: errorMessage });
  } finally {
    await client.end();
  }
}
