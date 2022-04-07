import { app, BrowserWindow, ipcMain, screen } from "electron";
// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.

  const mainWindow = new BrowserWindow({
    height: 525,
    width: 700,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      nodeIntegrationInSubFrames: true,
      nativeWindowOpen: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  ipcMain.on("window-close", (event, { id }) => {
    const targetWindow = windowByTitle(id);
    if (targetWindow) {
      let childWindows = BrowserWindow.getAllWindows();
      console.log(`before close we have ${childWindows.length} windows`);

      console.log(`close this window`);
      targetWindow.destroy();
      childWindows = BrowserWindow.getAllWindows();
      console.log(`after close we have ${childWindows.length} windows`);
    }
  });

  ipcMain.on("window-ready", (event, { id }) => {
    const targetWindow = windowByTitle(id);
    if (targetWindow) targetWindow.showInactive();
  });

  mainWindow.webContents.setWindowOpenHandler(
    ({ url, frameName, features, ...rest }) => {
      console.log(`setWindowOpenHandler '${frameName}'`, { features, rest });

      return {
        action: "allow",
        overrideBrowserWindowOptions: {
          show: false,
          frame: false,
          parent: mainWindow,
          roundedCorners: false,
          // resizable:false,
          transparent: true,
        },

        webPreferences: {
          preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
      };
    }
  );

  ipcMain.on("window-resize", (event, arg) => {
    console.log(`window resize ${arg.width}`);
    mainWindow.setSize(arg.width, arg.height);
  });

  const windowByTitle = (title: string) =>
    BrowserWindow.getAllWindows().find((w) => w.title === title);

  ipcMain.on("window-size", (event, { id, height, width }) => {
    console.log(id, width, height);
    const targetWindow = windowByTitle(id);
    if (targetWindow) {
      targetWindow.setContentSize(width, height);
    }
  });

  ipcMain.on("window-position", (event, { id, parentWindowID, left, top }) => {
    const targetWindow = windowByTitle(id);
    let mainWindow = windowByTitle(parentWindowID);
    if (!mainWindow && targetWindow) {
      // @ts-ignore
      mainWindow = targetWindow.getParentWindow();
    }
    if (targetWindow) {
      const mainBounds = mainWindow!.getContentBounds();

      let targetX = parseInt(left + mainBounds.x);
      let targetY = parseInt(top + mainBounds.y);
      // const size = screen.getDisplayNearestPoint({
      //   x: mainBounds.x,
      //   y: mainBounds.y,
      // }).size;

      // if (targetX < 0) {
      //   targetX = 0;
      // }
      // if (targetY + targetWindow!.getBounds().height > size.height) {
      //   targetY -= targetY + targetWindow!.getBounds().height - size.height;
      // }
      // if (targetX + targetWindow!.getBounds().width > size.width) {
      //   targetX -= targetX + targetWindow!.getBounds().width - size.width;
      // }
      try {
        targetWindow!.setPosition(targetX, targetY);
        // @ts-ignore
      } catch (e) {
        console.log(`error setting position`, e);
      }
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
