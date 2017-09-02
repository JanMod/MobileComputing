/**
 * Created by janmoder on 14.07.17.
 */
var module = angular.module('app');

module.service('SocketService', function ($http, $rootScope, $q) {

  this.calcRoute = function (parkingspot) {

    $rootScope.$emit('eventCalcRoute', {
      data: parkingspot
    });
 //   $scope.$emit('eventCalcRoute', parkingspot);
  }
});
