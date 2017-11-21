'use strict';

const electron = require('electron');
const ipcRenderer = electron.ipcRender;
const os = require('os');
const path = require('path');
const fs = require('fs-extra');

const webview = document.getElementById("webview");

webview.addEventListener('did-start-loading', () => {
    ipcRenderer.send('onconfing', 'ping');
});

webview.addEventListener('did-finish-load', () => {
    insert();
});

function insert() {
    fs.readFile(path.dirname(__dirname) + 'public/css/clip.css', 'utf8', (err, data) => {
        webview.insertCSS(data);
        if (err) {
            console.error(err);
        }
    });
}

ipcRenderer.on('onConfig', (event, config) => {
    webview.setAudioMuted(config.onAudioMuted);
});

ipcRenderer.on('AudioMuted', () => {
    if (webview.isAudioMuted()) {
        webview.setAudioMuted(false);
    } else {
        webview.setAudioMuted(true);
    };
});