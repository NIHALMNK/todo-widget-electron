const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("path");
const fs = require("fs");
const db = require("./db-main");

app.setName("Todo Widget");
app.disableHardwareAcceleration();

let win;

/* ---------- DATA DIR ---------- */
const dataDir = path.join(
  app.getPath("documents"),
  "TodoWidgetData"
);

function ensureDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

/* ---------- WINDOW ---------- */
function createWindow() {
  win = new BrowserWindow({
    width: 320,
    height: 420,
    frame: false,
    resizable: false,
    show: false,                 // 👈 start hidden
    backgroundColor: "#121212",
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.loadFile("index.html");
}

/* ---------- GLOBAL SHORTCUT ---------- */
function registerShortcut() {
  globalShortcut.register("Control+Alt+D", () => {
    if (!win) return;

    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
      win.focus();
    }
  });
}

/* ---------- TASK DEFAULTS ---------- */
ipcMain.handle("tasks:init-defaults", () => {
  const count = db.prepare("SELECT COUNT(*) c FROM tasks").get().c;
  if (count === 0) {
    const insert = db.prepare("INSERT INTO tasks (name) VALUES (?)");
    [
      "Wake up at 5:30 AM",
      "Morning walk",
      "Deep work",
      "Reading",
      "Skill practice",
      "Exercise",
      "Prayer",
      "Plan tomorrow",
      "Sleep on time"
    ].forEach(t => insert.run(t));
  }
});

/* ---------- TASKS ---------- */
ipcMain.handle("tasks:get", (_, date) => {
  return db.prepare(`
    SELECT t.id, t.name, IFNULL(d.done,0) done
    FROM tasks t
    LEFT JOIN daily_tasks d
      ON t.id = d.task_id AND d.date = ?
    WHERE t.active = 1
    ORDER BY t.id
  `).all(date);
});

ipcMain.handle("tasks:setDone", (_, { taskId, date, done }) => {
  db.prepare(`
    INSERT INTO daily_tasks (task_id, date, done)
    VALUES (?, ?, ?)
    ON CONFLICT(task_id, date)
    DO UPDATE SET done = excluded.done
  `).run(taskId, date, done ? 1 : 0);
});

/* ---------- STATS ---------- */
ipcMain.handle("stats:get", () => {
  return db.prepare(`
    SELECT COUNT(*) total, SUM(done) completed
    FROM daily_tasks
  `).get();
});

ipcMain.handle("streaks:get", () => {
  return db.prepare(`
    SELECT date
    FROM daily_tasks
    GROUP BY date
    HAVING SUM(done) = COUNT(*)
    ORDER BY date
  `).all();
});

/* ---------- EXPORT (MERGE) ---------- */
ipcMain.handle("export:json", (_, payload) => {
  ensureDir();
  const file = path.join(dataDir, "todo-data.json");

  let data = {};
  if (fs.existsSync(file)) {
    data = JSON.parse(fs.readFileSync(file, "utf-8"));
  }

  data[payload.date] = payload.tasks;
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
});

ipcMain.handle("export:csv", (_, payload) => {
  ensureDir();
  const file = path.join(dataDir, "todo-data.csv");

  let rows = ["Date,Task,Done"];
  if (fs.existsSync(file)) {
    rows = fs.readFileSync(file, "utf-8").trim().split("\n");
  }

  rows = rows.filter(r => !r.startsWith(payload.date + ","));
  payload.tasks.forEach(t => {
    rows.push(`${payload.date},"${t.name}",${t.done ? "Yes" : "No"}`);
  });

  fs.writeFileSync(file, rows.join("\n"));
});

/* ---------- APP LIFECYCLE ---------- */
app.whenReady().then(() => {
  createWindow();
  registerShortcut();
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
