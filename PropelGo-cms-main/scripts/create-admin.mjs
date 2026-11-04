
import mariadb from "mariadb";
import bcrypt from "bcryptjs";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const rl = createInterface({ input: stdin, output: stdout });

let connection;

try {
  const name = (await rl.question("Admin name: ")).trim();
  const email = (await rl.question("Admin email: ")).trim().toLowerCase();
  const password = await rl.question(
    "Admin password (input will be visible): ",
  );

  if (!name || !email || password.length < 12) {
    throw new Error(
      "Name and email are required. Password must be at least 12 characters.",
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address.");
  }

  connection = await mariadb.createConnection({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: "utf8mb4",
  });

  const existing = await connection.query(
    "SELECT id FROM admin_users WHERE email = ? LIMIT 1",
    [email],
  );

  if (existing.length > 0) {
    throw new Error("An admin with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await connection.query(
    "INSERT INTO admin_users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, passwordHash],
  );

  console.log("Admin account created successfully.");
  console.log("Email:", email);
  console.log("Keep your password private.");
} catch (error) {
  console.error(
    "Admin creation failed:",
    error instanceof Error ? error.message : "Unknown error",
  );
  process.exitCode = 1;
} finally {
  if (connection) await connection.end();
  rl.close();
}
