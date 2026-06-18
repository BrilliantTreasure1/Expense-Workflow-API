import { pool } from "../config/db"

async function migrate() {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phonenumber TEXT NOT NULL,
        password TEXT NOT NULL
      );
    `);
    console.log("✅ Users table created");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS workflows (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        title TEXT NOT NULL,
        budget NUMERIC NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP
      );
    `);
    console.log("✅ Workflows table created");

    await pool.query(`
      ALTER TABLE workflows ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'
    `);
    console.log("✅ Status column added to workflows");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        workflow_id INTEGER NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        amount NUMERIC NOT NULL,
        category TEXT,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP
      );
    `);
    console.log("✅ Expenses table created");

    await pool.end();

  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrate();