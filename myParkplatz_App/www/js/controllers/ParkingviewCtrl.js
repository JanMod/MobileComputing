/**
 * Created by janmoder on 11.07.17.
 */
/**
 * Created by janmoder on 10.07.17.
 */
var module = angular.module('app');
module.controller('ParkingviewCtrl', function (parkingspotFactory, SocketService, $scope, $stateParams, $state, $ionicPopup, $ionicHistory) {
  console.log($stateParams.parkingspot);
  $scope.parkingspot = parkingspotFactory.getParking_Map().get(JSON.parse($stateParams.parkingspot));

  $scope.deleteParkingspot = function () {
    $scope.showConfirm();
  }

  // A confirm dialog
  $scope.showConfirm = function () {
    var confirmPopup = $ionicPopup.confirm({
      title: $scope.parkingspot.name + ' entfernen.',
      template: 'Bist du da dir sehr sicher?',
      cancelText: 'Abbrechen'
    });

    confirmPopup.then(function (res) {
      if (res) {
        parkingspotFactory.deleteParkingspotDatabase($scope.parkingspot._id);
        $ionicHistory.goBack();
      }
    });
  };


  $scope.navigate = function () {
    SocketService.calcRoute($scope.parkingspot);
  }
});
