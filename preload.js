const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  initDefaults: () => ipcRenderer.invoke("tasks:init-defaults"),
  getTasks: date => ipcRenderer.invoke("tasks:get", date),
  setDone: data => ipcRenderer.invoke("tasks:setDone", data),
  getStats: () => ipcRenderer.invoke("stats:get"),
  getStreaks: () => ipcRenderer.invoke("streaks:get"),

  exportJson: data => ipcRenderer.invoke("export:json", data),
  exportCsv: data => ipcRenderer.invoke("export:csv", data)
});
