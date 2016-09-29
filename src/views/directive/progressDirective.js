


(function (app) {
  app.directive('progressDirective', function(){
    return {
      restrict: 'E',
      scope: {
        progress: '@'
      },
      controller:['$scope', function ($scope) {
        $scope.toClass = function(pro){
          return 'p' + pro;
        };
      }],
      transclude:true,
      template:'<div class="c100" ng-class="toClass(progress)">'
      +'    <span><ng-transclude></ng-transclude></span>'
      +'    <div class="slice">'
      +'        <div class="bar"></div>'
      +'        <div class="fill"></div>'
      +'    </div>'
      +'</div>',
    }
  });

})(angular.module('app'));
