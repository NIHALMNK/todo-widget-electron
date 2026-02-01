const { app, BrowserWindow } = require("electron");

// Silence Chromium GPU cache errors (Windows)
app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("disable-gpu-cache");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 320,
    height: 460,
    frame: false,
    backgroundColor: "#121212",
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile("index.html");
  // Uncomment ONLY if debugging
  // win.webContents.openDevTools({ mode: "detach" });
}

app.whenReady().then(createWindow);
