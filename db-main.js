const { app } = require("electron");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const userData = app.getPath("userData");
if (!fs.existsSync(userData)) {
  fs.mkdirSync(userData, { recursive: true });
}

const dbPath = path.join(userData, "todo.db");
const db = new Database(dbPath);

db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    active INTEGER DEFAULT 1
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS daily_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER,
    date TEXT,
    done INTEGER DEFAULT 0,
    UNIQUE(task_id, date)
  )
`).run();

module.exports = db;
