'use strict';

const electron = require('electron');
const path = require('path');
const request = require('request');
const template = require('./models/menus');
const execSync = require('child_process').execSync;

const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const app = electron.app;
const Menu = electron.Menu;
const globalShortcut = electron.globalShortcut;
const config = require('./config/config');

const gameTitle = '艦隊これくしょん';
const gameUrl = 'http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/';
const scrollX = 124;
const scrollY = 77;
const winWidth = 800;
const winHeight = 502;

app.commandLine.appendSwitch('ppapi-flash-path', __dirname + '/PepperFlash/PepperFlashPlayer.plugin');
app.commandLine.appendSwitch('ppapi-flash-version', '27.0.0.187');

app.on('ready', function() {
    let win = new BrowserWindow({
        resizable: false,
        width: winWidth,
        height: winHeight,
        transparent: false,
        fullscreenable: false,
        webPreferences: {
            plugins: true
        }
    });
    win.setMenu(null);

    win.loadURL(gameUrl);

    globalShortcut.register('f5', function() {
        console.log('Bukket Collection has been reloaded.');
        win.webContents.reload();
    });

    win.webContents.on('did-finish-load', function() {
        console.log('did-finish-load');

        win.webContents.executeJavaScript('window.scrollTo(' + scrollX + ',' + scrollY + ');');
        win.webContents.executeJavaScript("document.documentElement.style.overflow = 'hidden';");

        let title = win.webContents.getTitle();
        if (!title.indexOf(gameTitle)) {
            console.log('title matched.');
        }


    });

    win.on('closed', function() {
        console.log('Bukket Collection has been closed.');
        win = null;
        app.quit();
    });

    template[2].submenu[1].checked = config.onAudioMuted;
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    };
});

ipcMain.on('onConfig', (event, message) => {
    event.sender.send('onConfig', config);
});