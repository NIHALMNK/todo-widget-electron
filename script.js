window.addEventListener("DOMContentLoaded", () => {
  const db = require("./db");
  const fs = require("fs");
  const path = require("path");
  const { exec } = require("child_process");

  /* ---------- EXPORT DIR ---------- */
  const EXPORT_DIR = path.join(
    process.env.USERPROFILE,
    "Documents",
    "TodoWidgetData"
  );

  if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
  }

  /* ---------- DATE ---------- */
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById("date").innerText = today;

  /* ---------- DEFAULT TASKS (FORCE SAFE) ---------- */
  const DEFAULT_TASKS = [
  "Wake up at 5:30 AM",
  "Morning walk",
  "Deep work (most important task)",
  "Reading (20 minutes)",
  "Skill practice (coding / learning)",
  "Exercise (strength or cardio)",
  "Prayer (5 times)",
  "Plan tomorrow",
  "Sleep on time"
];

  const existing = db.prepare("SELECT COUNT(*) c FROM tasks").get().c;
  if (existing === 0) {
    const insert = db.prepare("INSERT INTO tasks (name) VALUES (?)");
    DEFAULT_TASKS.forEach(t => insert.run(t));
  }

  /* ---------- LOAD TASKS ---------- */
  function loadTasks() {
    const tasks = db.prepare(`
      SELECT t.id, t.name, IFNULL(d.done,0) done
      FROM tasks t
      LEFT JOIN daily_tasks d
        ON t.id=d.task_id AND d.date=?
      WHERE t.active=1
    `).all(today);

    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => {
      const li = document.createElement("li");
      const cb = document.createElement("input");
      const sp = document.createElement("span");

      cb.type = "checkbox";
      cb.checked = task.done === 1;
      sp.innerText = task.name;

      cb.onchange = () => {
        db.prepare(`
          INSERT INTO daily_tasks (task_id,date,done)
          VALUES (?,?,?)
          ON CONFLICT(task_id,date)
          DO UPDATE SET done=excluded.done
        `).run(task.id, today, cb.checked ? 1 : 0);

        renderStats();
        renderStreak();
      };

      li.append(cb, sp);
      list.appendChild(li);
    });

    renderStats();
    renderStreak();
  }

  /* ---------- STATS ---------- */
  function renderStats() {
    const r = db.prepare(`
      SELECT COUNT(*) total, SUM(done) completed
      FROM daily_tasks
    `).get();

    document.getElementById("stats").innerText =
      `All time: ${r.completed || 0}/${r.total || 0}`;
  }

  /* ---------- STREAK ---------- */
  function renderStreak() {
    const days = db.prepare(`
      SELECT date FROM daily_tasks
      GROUP BY date
      HAVING SUM(done)=COUNT(*)
      ORDER BY date
    `).all().map(r => r.date);

    let best = 0, temp = 0;
    for (let i = 0; i < days.length; i++) {
      if (i === 0 || new Date(days[i]) - new Date(days[i-1]) !== 86400000)
        temp = 1;
      else temp++;
      best = Math.max(best, temp);
    }

    document.getElementById("streak").innerText =
      `🏆 best streak: ${best}`;
  }

  /* ---------- EXPORT ---------- */
  function getAllData() {
    return db.prepare(`
      SELECT d.date, t.name, d.done
      FROM daily_tasks d
      JOIN tasks t ON t.id=d.task_id
    `).all();
  }

  document.getElementById("exportCsv").onclick = () => {
    const rows = getAllData();
    if (!rows.length) return alert("No data yet");

    let csv = "date,task,done\n";
    rows.forEach(r => csv += `${r.date},"${r.name}",${r.done}\n`);

    const file = path.join(EXPORT_DIR, "todo-data.csv");
    fs.writeFileSync(file, csv);
    exec(`start "" "${file}"`);
  };

  document.getElementById("exportJson").onclick = () => {
    const file = path.join(EXPORT_DIR, "todo-data.json");
    fs.writeFileSync(file, JSON.stringify(getAllData(), null, 2));
    exec(`notepad "${file}"`);
  };

  loadTasks();
});
