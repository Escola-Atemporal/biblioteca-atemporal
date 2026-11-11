import "server-only";
import { Pool, type PoolClient, type QueryResultRow } from "pg";

const connectionString = process.env.DATABASE_URL;
export const databaseConfigured = Boolean(connectionString);

const globalDb = globalThis as typeof globalThis & { __bibliotecaPgPool?: Pool };
function pool(): Pool {
  if (!connectionString) throw new Error("DATABASE_URL not configured");
  if (!globalDb.__bibliotecaPgPool) {
    globalDb.__bibliotecaPgPool = new Pool({
      connectionString,
      max: 3,
      idleTimeoutMillis: 25000,
      connectionTimeoutMillis: 9000,
      ssl: { rejectUnauthorized: false },
      application_name: "biblioteca-atemporal-acesso",
    });
  }
  return globalDb.__bibliotecaPgPool;
}

export async function dbQuery<T extends QueryResultRow>(sql: string, params: unknown[] = []): Promise<T[]> {
  const result = await pool().query<T>(sql, params);
  return result.rows;
}

export async function transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    const value = await fn(client);
    await client.query("COMMIT");
    return value;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
