'use strict';

const electron = require('electron');
const path = require('path');
const request = require('request');
const fs = require('fs');
const template = require('./models/menus');
const execSync = require('child_process').execSync;
const setWin = require('./setWin.json');
const winPath = require('path').join(__dirname, 'setWin.json');

const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const app = electron.app;
const Menu = electron.Menu;
const globalShortcut = electron.globalShortcut;
const config = require('./config/config');

const gameTitle = '艦隊これくしょん';
const gameUrl = 'http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/';
const userAgent = "Chrome/62.0.3202.94"
const scrollX = 124;
const scrollY = 77;
const winWidth = 800;
const winHeight = 502;

const flash = execSync('mdfind  -onlyin ~/Library/Application\\ Support PepperFlashPlayer.plugin').toString().replace(/\r?\n/g, "");

app.setPath('pepperFlashSystemPlugin', flash);
app.commandLine.appendSwitch('ppapi-flash-path', app.getPath('pepperFlashSystemPlugin'));

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
    //let subwin = new BrowserWindow({
    //    width: 800,
    //    height: 250
    //});
    win.setMenu(null);

    win.loadURL(gameUrl, { userAgent: userAgent });

    win.setPosition(setWin["x"], setWin["y"]);
    win.setSize(setWin["width"], setWin["height"]);

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

    win.on('close', function() {
        let item = JSON.stringify(win.getBounds());
        fs.writeFile(winPath, item);

    })

    win.on('closed', function() {
        win = null;
        //subwin = null;
        app.quit();

        console.log('Bukket Collection has been closed.');
    });

    template[2].submenu[1].checked = config.onAudioMuted;
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    //subwin.loadURL("file://" + __dirname + "/stats.html");
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    };
});

ipcMain.on('onConfig', (event, message) => {
    event.sender.send('onConfig', config);
});