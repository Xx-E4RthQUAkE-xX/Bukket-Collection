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
                accelerator: 'Shift + P',
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
                role: 'minimize'
            },
            {
                role: 'close'
            },
        ]
    },
    {
        role: 'help',
        submenu: [{
            label: 'Learn more',
            click() {
                electron.shell.openExternal('https://github.com/Xx-E4RthQUAkE-xX/Bukket-Collection');
            },
        }]
    },
];

if (process.platform === 'darwin') {
    const name = electron.app.getName();
    template.unshift({
        label: name,
        submenu: [{
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                role: 'hide'
            },
            {
                role: 'hideothers'
            },
            {
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                role: 'quit'
            },
        ]
    });

    template[3].submenu = [{
            label: '閉じる',
            accelerator: 'Shift + C',
            role: 'close'
        },
        {
            label: '最小化',
            accererator: 'Shift + M',
            role: 'minimize'
        },
        {
            label: '拡大',
            role: 'zoom'
        },
        {
            type: 'separator'
        },
        {
            label: '最前面に移動',
            role: 'front'
        }
    ];
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

module.exports = template;