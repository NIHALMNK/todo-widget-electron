window.addEventListener("DOMContentLoaded", async () => {

  /* ---------- helpers ---------- */
  function formatDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  function addDays(dateStr, days) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return formatDate(d);
  }

  /* ---------- state ---------- */
  const TODAY = formatDate(new Date());
  let currentDate = TODAY;
  let lastKnownDate = TODAY;

  /* ---------- elements ---------- */
  const dateEl = document.getElementById("date");
  const taskList = document.getElementById("taskList");
  const statsEl = document.getElementById("stats");
  const streakEl = document.getElementById("streak");
  const calendarEl = document.getElementById("calendar");
  const exportJsonBtn = document.getElementById("exportJson");
  const exportCsvBtn = document.getElementById("exportCsv");

  dateEl.innerText = TODAY;

  await window.api.initDefaults();

  /* ---------- load tasks ---------- */
  async function load(date) {
    const tasks = await window.api.getTasks(date);
    taskList.innerHTML = "";

    tasks.forEach(t => {
      const li = document.createElement("li");
      const cb = document.createElement("input");
      const sp = document.createElement("span");

      cb.type = "checkbox";
      cb.checked = t.done === 1;
      cb.disabled = date !== TODAY;
      sp.innerText = t.name;

      cb.onchange = async () => {
        await window.api.setDone({
          taskId: t.id,
          date,
          done: cb.checked
        });

        // 🔥 AUTO-SAVE ON EVERY CHANGE
        const updatedTasks = await window.api.getTasks(date);
        await window.api.exportJson({ date, tasks: updatedTasks });
        await window.api.exportCsv({ date, tasks: updatedTasks });

        renderStats();
        renderStreaks();
      };

      li.append(cb, sp);
      taskList.appendChild(li);
    });
  }

  /* ---------- stats ---------- */
  async function renderStats() {
    const r = await window.api.getStats();
    const percent = r.total ? Math.round((r.completed / r.total) * 100) : 0;
    statsEl.innerText = `All time: ${r.completed}/${r.total} (${percent}%)`;
  }

  async function renderStreaks() {
    const rows = await window.api.getStreaks();
    streakEl.innerText = `🔥 days completed: ${rows.length}`;
  }

  /* ---------- auto day change ---------- */
  setInterval(async () => {
    const now = formatDate(new Date());
    if (now !== lastKnownDate) {
      const yesterday = lastKnownDate;
      const tasks = await window.api.getTasks(yesterday);

      await window.api.exportJson({ date: yesterday, tasks });
      await window.api.exportCsv({ date: yesterday, tasks });

      lastKnownDate = now;
      currentDate = now;
      dateEl.innerText = now;
      load(now);
    }
  }, 60 * 1000);

  /* ---------- calendar ---------- */
  function renderCalendar(baseDate) {
    calendarEl.innerHTML = "";

    const d = new Date(baseDate);
    d.setDate(1);

    const month = d.getMonth();
    const year = d.getFullYear();
    const firstDay = d.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid = document.createElement("div");
    grid.className = "calendar-grid";

    for (let i = 0; i < firstDay; i++) {
      grid.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("div");
      cell.className = "calendar-day";

      const dateStr = formatDate(new Date(year, month, day));
      cell.innerText = day;

      if (dateStr === TODAY) cell.classList.add("today");

      cell.onclick = () => {
        currentDate = dateStr;
        dateEl.innerText = dateStr;
        calendarEl.classList.add("hidden");
        load(currentDate);
      };

      grid.appendChild(cell);
    }

    calendarEl.appendChild(grid);
  }

  /* ---------- interactions ---------- */
  dateEl.onclick = () => {
    calendarEl.classList.toggle("hidden");
    renderCalendar(currentDate);
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") currentDate = addDays(currentDate, -1);
    if (e.key === "ArrowRight") currentDate = addDays(currentDate, 1);

    dateEl.innerText = currentDate;
    calendarEl.classList.add("hidden");
    load(currentDate);
  });

  /* ---------- manual export (still works) ---------- */
  exportJsonBtn.onclick = async () => {
    const tasks = await window.api.getTasks(currentDate);
    await window.api.exportJson({ date: currentDate, tasks });
  };

  exportCsvBtn.onclick = async () => {
    const tasks = await window.api.getTasks(currentDate);
    await window.api.exportCsv({ date: currentDate, tasks });
  };

  /* ---------- init ---------- */
  load(TODAY);
  renderStats();
  renderStreaks();
});
