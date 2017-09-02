/**
 * Created by janmoder on 10.07.17.
 */
var module = angular.module('app');
module.controller('ListCtrl', function ($scope, $state, $rootScope, parkingspotFactory) {

  $scope.viewParking = function (index) {
    $state.go('main.listparkingspot', {parkingspot: angular.toJson($scope.parkingspots[index][0])});
  }





  $rootScope.$on('onLoad', function (event, user) {
    $scope.parkingspots = Array.from(parkingspotFactory.getParking_Map());
    $scope.parkingspots.forEach(function (parkingspot) {
      parkingspot.distance = $scope.getDistance(parkingspotFactory.getUser(), parkingspot[1])
    })
  //  $scope.loadData();
  })


  ///https://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3
  //Haversine formula
  var rad = function (x) {
    return x * Math.PI / 180;
  };

  $scope.getDistance = function (p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.loc[0] - p1.loc[0]);
    var dLong = rad(p2.loc[1] - p1.loc[1]);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1.loc[0])) * Math.cos(rad(p2.loc[1])) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    console.log(d);
    return d.toFixed(2); // zwei Nachkomma stellen
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////
});
