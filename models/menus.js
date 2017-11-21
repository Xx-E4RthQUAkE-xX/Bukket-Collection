'use strict';

const electron = require('electron');
const Menu = electron.Menu;
const ipcRenderer = electron.ipcRenderer;
const os = require('os');
const capture = require('./capture');

let PATH = os.homedir() + '/Pictures/screenshot/';

const template = [{
        label: '表示',
        submenu: [{
            label: '再読み込み',
            accelerator: 'Shift + R',
            click(item, focusedWindow) {
                if (focusedWindow) focusedWindow.reload();
            }
        }, ]
    },
    {
        label: 'ツール',
        submenu: [{
                label: 'スクリーンショット',
                accelerator: 'Shift + F12',
                click(item, focusedWindow) {
                    if (focusedWindow) capture(PATH, focusedWindow);
                }
            },
            {
                label: 'ミュート',
                accelerator: 'Shift + M',
                type: 'checkbox',
                click(item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.webContents.send('Audiomuted', 'ping');
                        return item.checked;
                    }
                }
            }
        ]
    },
    {
        label: 'ウィンドウ',
        role: 'window',
        submenu: [{
            label
        }]
    }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

module.exports = template;