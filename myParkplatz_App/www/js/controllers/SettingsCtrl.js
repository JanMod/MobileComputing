/**
 * Created by janmoder on 10.07.17.
 */
var module = angular.module('app');
module.controller('SettingsCtrl', function ($scope, parkingspotFactory) {
  $scope.value = parkingspotFactory.getUser().mapRadius;

  $scope.sliderChanged = function (value) {
    parkingspotFactory.getUser().mapRadius = value;
    parkingspotFactory.getUser().GoogleMap.circle.setRadius(parseFloat(parkingspotFactory.getUser().mapRadius));
  }
});
