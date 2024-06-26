import { app, BrowserWindow } from "electron";
import path from "path";

app.disableHardwareAcceleration();

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1300,
        height: 750,
        show: false,
        darkTheme: true,
        fullscreen: process.env.NODE_ENV === "production",
        autoHideMenuBar: true,
        webPreferences: {
            webSecurity: false
        }
    });

    let indexPath = "http://localhost:3000";
    if (process.env.NODE_ENV === "production") {
        indexPath = "file://" + path.join(__dirname, "..", "index.html");
    }

    mainWindow.loadURL(indexPath);
    mainWindow.once("ready-to-show", () => mainWindow.show());
    mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", () => createWindow());

app.commandLine.appendSwitch("disable-site-isolation-trials");
app.commandLine.appendSwitch("ignore-certificate-errors");

app.on("window-all-closed", () => app.quit());
app.on("activate", () => {
    if (mainWindow === null) createWindow();
});
