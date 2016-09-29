const electron = require('electron');

const ipc = electron.ipcMain;
const Rx = require('rx');
const PERIOD = 1000;
const notifier = require('node-notifier');

var mainWindow,
    observer;

var ipcService = {
  start: function(type){
    if (observer){
        observer.dispose();
    }

    var dueTypeInSec = type;// * 60;
    observer = Rx.Observable.timer(0, 1000)//(dueType, PERIOD)
        .take(dueTypeInSec)
        .subscribe(
            function(x) {
                mainWindow.webContents.send('tick', dueTypeInSec - x);
                console.log('tick');
            },
            function(err){
            },
            function(x){
                mainWindow.webContents.send('complete');

                notifier.notify({
                    'title': 'Time is out',
                    'message': 'your stoun is dtouned',
                    sound: true,
                    wait: true
                });

                notifier.on("click", function (err, response) {
                  mainWindow.show();
                });
            });
  },
  stop: function(){
    if (observer){
        observer.dispose();
        mainWindow.webContents.send('complete');
    }
  }
}

ipc.on('promodoro-start', function(ect, type) {
  ipcService.start(type);
});

ipc.on('promodoro-stop', function() {
  ipcService.stop();
});

ipc.on('hide-window', function() {
  mainWindow.hide();
});

module.exports = function(mw){
  mainWindow = mw;
  return ipcService;
};
