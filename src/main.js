const electron = require('electron');
const path     = require('path');

var Positioner = require('electron-positioner')

const {app, Tray, Menu} = electron;
const BrowserWindow = electron.BrowserWindow;

const DEFDUR = 25;

var mainWindow;
var tray;

var showHide = function functionName() {
  if(mainWindow.isVisible()){
    mainWindow.hide();
  }else{
    mainWindow.show();
  }
}

app.on('ready', _ => {

    mainWindow = new BrowserWindow({
      height      : 210,
      width       : 300,
      frame       : false,
      show        : true,
      skipTaskbar : true
    });

    var positioner = new Positioner(mainWindow);

    positioner.move('bottomRight');

    //mainWindow.openDevTools();
    mainWindow.loadURL(`file://${__dirname}/views/countdown.html`)

    tray = new Tray(path.join('src', 'assets', '1474916310_clock.png'));

    const ipcService = require('./ipcService')(mainWindow);

    const menu = Menu.buildFromTemplate([
      {
        label: 'show/hide',
        click: showHide
      },
      {
        label: 'start',
        click: ()=>{
          ipcService.start(DEFDUR);
        }
      },
      {
        label: 'stop',
        click: ()=>{
          ipcService.stop();
        }
      }
    ]);

    tray.setContextMenu(menu)

});
