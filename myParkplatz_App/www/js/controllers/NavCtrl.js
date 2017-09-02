/**
 * Created by janmoder on 10.07.17.
 */
var module = angular.module('app');


module.controller('NavCtrl', function ($scope, $ionicSideMenuDelegate, $state, $rootScope, parkingspotFactory) {
  $scope.showMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };


  $rootScope.$on('$stateChangeStart',
    function (event, toState, toParams, fromState, fromParams) {

      if (toState.url === "/history") {
        console.log(toState.url);
        parkingspotFactory.getMarkerFromRegion();
      }

      if (toState.url === "/map") {
        console.log(toState.url);
        parkingspotFactory.getMarkerFromRegion();
      }
    })

})
