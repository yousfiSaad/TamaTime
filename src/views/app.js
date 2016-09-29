const electron = require('electron');


(function () {

  const ipc = electron.ipcRenderer;

  angular.module('app', [])
      .value('ipc', ipc)
      //
      // TODO: make it provider
      .factory('ipcService', ['ipc', '$rootScope', function (ipc, $rootScope) {
        let onTick, onComplete;

        ipc.on('tick', function(evt, count) {
          $rootScope.$apply(function () {
            onTick(count);
          });
        });

        ipc.on('complete', function(evt, count) {
          $rootScope.$apply(function () {
            onComplete();
          });
        });

        return {
          start: function (type) {
            // TODO: make it configurable
              ipc.send('promodoro-start', 25);
          },
          stop: function () {
              ipc.send('promodoro-stop');
          },
          onTick(cb){
            onTick = cb;
          },
          onComplete(cb){
            onComplete = cb;
          },
          hideWindow: function () {
            ipc.send('hide-window');
          }
        }
      }])

      .controller('mainCtrl', ['ipcService', '$scope', function (ipcService, $scope) {
        $scope.done = true;
        $scope.ceil = window.Math.ceil;

        ipcService.onTick(function (c) {
          $scope.countDown = c;
          $scope.done = false;
        });

        ipcService.onComplete(function (c) {
          $scope.done = true;
        });

        $scope.startStop = function () {
          if($scope.done){
            $scope.start();
          }else{
            $scope.stop();
          }
        };

        $scope.start = function () {
          ipcService.start();
        };

        $scope.stop = function () {
          ipcService.stop();
          $scope.done = true;
        };

        $scope.hideWindow = ()=>{
          ipcService.hideWindow();
        };

      }]);
})();
