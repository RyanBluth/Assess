'use strict';
var electron = require('electron');
var Menu = require('menu');
var MenuItem = require('menu-item');
// Module to control application life.
var app = electron.app;
// Module to create native browser window.
var BrowserWindow = electron.BrowserWindow;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
    
    {
        let t = require("./app/loaders/image");
        t.load()
    }
    {
        let t = require("./app/loaders/int");
        t.load()
    }
    /*// Setup menu
    var menu = new Menu();
    menu.append(new MenuItem({ label: 'MenuItem1', click: function () { console.log('item 1 clicked'); } }));
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }));
    Menu.setApplicationMenu(menu);*/
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
