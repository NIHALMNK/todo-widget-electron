# 📝 Todo Widget (Electron)

A **minimal, distraction-free daily todo widget** built with **Electron + SQLite**.

This project is not about managing hundreds of tasks. It is about **building daily discipline**, creating a visible routine, and measuring consistency over time.

---

## 🎯 Why This Project Exists

Most todo apps fail for one simple reason:

* They **carry yesterday’s unfinished tasks** into today
* They create **guilt**, not clarity
* They optimize for features, not behavior

This widget follows a different philosophy:

> **Every day starts clean.**
> What you do today matters. Yesterday is data, not baggage.

---

## 🧠 Core Philosophy

* Discipline > Motivation
* Visibility > Notifications
* Data > Feelings
* Local > Cloud

This app intentionally avoids complexity so that **using it becomes a habit**, not a chore.

---

## ✨ Key Features

### ✅ Daily-Based Tasks

* Tasks reset every day
* No automatic carry-over
* Each date has its own completion state

### 🪟 Desktop Widget

* Small, floating window
* Always accessible
* Draggable and frameless
* Designed to stay out of your way

### 💾 Local-First Storage

* Uses SQLite
* No login
* No cloud sync
* Your data stays on your machine

### 📊 Progress Tracking

* Completion stats
* Streak tracking
* Historical data preserved

### 📤 Data Export

* Export to **CSV** (Excel-friendly)
* Export to **JSON**
* Use your data for analysis, charts, or personal review

---

## 🖥️ How to Use the App (User Guide)

### 1. Open the App

* Launch the widget
* Today’s date appears at the top

### 2. Complete Your Tasks

* Check tasks as you complete them
* Progress is saved instantly

### 3. End of Day

* No action needed
* Tomorrow starts with a fresh list
* Today becomes historical data

### 4. Export Your Data

* Click **Export CSV** to analyze in Excel
* Click **Export JSON** for custom processing

Exported files are stored at:

```
Documents/TodoWidgetData/
```

---

## 📈 Why This Is Important

### Builds Real Discipline

You are forced to make a daily choice:

* Do the task
* Or don’t

No hiding behind overdue lists.

### Encourages Honest Reflection

Missed days are not punished.
They are simply recorded.

This removes emotional friction and increases long-term consistency.

### Enables Self-Analysis

Because data is stored cleanly:

* You can analyze weekly consistency
* Measure streaks
* Visualize improvement over months

This turns habits into **measurable behavior**.

---

## 🗄️ Data Model (Simple by Design)

### Tables

**tasks**

* Defines the routine
* Rarely changes

**daily_tasks**

* Stores task completion per date
* One row per task per day

There is no magic automation.
If a task is not checked, it is not recorded.

---

## 🧑‍💻 Developer Setup

### Requirements

* Node.js (LTS)
* npm

### Installation

```bash
git clone <repository-url>
cd todo-widget
npm install
npm start
```

### Project Structure

```
todo-widget/
├── main.js        # Electron main process
├── script.js      # App logic
├── db.js          # SQLite setup
├── index.html     # UI markup
├── style.css      # Styling
├── package.json
└── todo.db        # Auto-created (ignored by Git)
```

---

## 🚫 What This App Intentionally Does NOT Do

* ❌ No cloud sync
* ❌ No accounts or authentication
* ❌ No notifications
* ❌ No task prioritization
* ❌ No reminders
* ❌ No AI-generated motivation

Simplicity is a feature.

---

## 📦 Building the Application

```bash
npm run build
```

Build output appears in:

```
dist/
```

> The `dist` folder is intentionally excluded from Git.
> Executables are shared via GitHub Releases.

---

## 🧠 Ideal Use Case

This widget is ideal for:

* Developers
* Students
* Knowledge workers
* Anyone building a daily routine

Especially useful for people who want **structure without pressure**.

---

## 📄 License

ISC

---

## 🤝 Contribution Philosophy

Keep contributions:

* Minimal
* Focused
* Purpose-driven

This project values clarity over features.
