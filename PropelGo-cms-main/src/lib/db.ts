
import "server-only";
import mariadb from "mariadb";

const database = mariadb.createPool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
  acquireTimeout: 10000,
  charset: "utf8mb4",
});

export async function query<T = unknown>(
  sql: string,
  values: unknown[] = [],
): Promise<T> {
  let connection;

  try {
    connection = await database.getConnection();
    return (await connection.query(sql, values)) as T;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function testDatabaseConnection(): Promise<boolean> {
  const rows = await query<Array<{ database_name: string }>>(
    "SELECT DATABASE() AS database_name",
  );

  return rows[0]?.database_name === process.env.DB_NAME;
}
