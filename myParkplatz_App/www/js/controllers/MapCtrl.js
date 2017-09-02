/**
 * Created by janmoder on 10.07.17.
 */
var module = angular.module('app');

module.controller('MapCtrl', function ($scope, $state, $rootScope, $interval, $cordovaGeolocation, $ionicModal, parkingspotFactory) {



  $scope.showFooter = false;
  $scope.showAddParkinspot = false;
  $scope.showButtonNext = false;

  $ionicModal.fromTemplateUrl('./templates/screen/addparkingspot.html', {
    scope: $scope,
    animation: 'slideInDown'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function () {
    $scope.modal.show();
  };
  $scope.closeModal = function () {
    $scope.modal.hide();
  };


  var options = {timeout: 10000, enableHighAccuracy: true};
  $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
    parkingspotFactory.getUser().loc[0] = position.coords.latitude;
    parkingspotFactory.getUser().loc[1] = position.coords.longitude;

    latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    console.log(parkingspotFactory.getUser().loc);

    var mapOptions = {
      center: {lat: parkingspotFactory.getUser().loc[0], lng: parkingspotFactory.getUser().loc[1]},
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
    };
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    parkingspotFactory.getUser().GoogleMap.circle = new google.maps.Circle({
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      clickable: false,
      fillColor: '#FFFFFF',
      fillOpacity: 0.3,
      map: $scope.map,
      center: {lat: parkingspotFactory.getUser().loc[0], lng: parkingspotFactory.getUser().loc[1]},
      radius: parseFloat(parkingspotFactory.getUser().mapRadius)
    });

    parkingspotFactory.getUser().GoogleMap.marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: {lat: parkingspotFactory.getUser().loc[0], lng: parkingspotFactory.getUser().loc[1]}
    });

    $scope.initialize();

    var watchOptions = {
      timeout: 3000,
      enableHighAccuracy: false // may cause errors if true
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
      null,
      function (err) {
      },
      function (position) {
        console.log("position changed");
        parkingspotFactory.getUser().loc[0] = position.coords.latitude;
        parkingspotFactory.getUser().loc[1] = position.coords.longitude;
        $scope.updateUseronMap(parkingspotFactory.getUser());
      });

    $scope.showAddParkinspot = true; //Add-Button
  }, function (error) {
    console.log("Could not get location");
  });


  $scope.addMarker = function (parkingspot) {
    if (!parkingspotFactory.getParking_Map().get(parkingspot._id)) {
      parkingspot.GoogleMap.marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: {lat: parkingspot.loc[0], lng: parkingspot.loc[1]},
        icon: "./icons/parking.png"
      });

      parkingspot.GoogleMap.clickevent = parkingspot.GoogleMap.marker.addListener('click', function () { //Setzt auf die Marker ein Clickevent
        $scope.map.panTo({lat: parkingspot.loc[0], lng: parkingspot.loc[1]});
        $scope.changeState(JSON.stringify(parkingspot._id));
      });
      parkingspot.actionFromServer = "";
      parkingspotFactory.getParking_Map().set(parkingspot._id, parkingspot);
    }
  };


  $scope.updateUseronMap = function (user) {
    user.GoogleMap.marker.setPosition({lat: user.loc[0], lng: user.loc[1]});
    user.GoogleMap.circle.setCenter({lat: user.loc[0], lng: user.loc[1]});
    $scope.map.panTo({lat: user.loc[0], lng: user.loc[1]});
    user.GoogleMap.circle.setRadius(parseFloat(user.mapRadius));
    parkingspotFactory.getMarkerFromRegion();
  }

  $scope.addParkingSlot = function () {
    $scope.addingParkingspot = parkingspotFactory.createParkingspotObject(); //Konstruktor
    $scope.addingParkingspot.GoogleMap.marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      icon: "./icons/addparking.png"
    });
    $scope.showFooter = true; // Footer hinzugefügt
    $scope.showAddParkinspot = false; // Add Button entfernt
    $scope.showButtonNext = true; //


    $scope.addingParkingspot.GoogleMap.clickevent = google.maps.event.addListener($scope.map, "click", function (event) {
      $scope.showButtonNext = true; // Zu ändern
      $scope.addingParkingspot.loc[0] = event.latLng.lat();
      $scope.addingParkingspot.loc[1] = event.latLng.lng();
      $scope.addingParkingspot.GoogleMap.marker.setPosition(event.latLng);
    })
  }
  $scope.loadMarker = function () {
    parkingspotFactory.getMarkerFromRegion();
  }

  $scope.deleteParkingspot = function (parkingspot_id) {
    var parkingspot = parkingspotFactory.getParking_Map().get(parkingspot_id);
    if (parkingspot) {
      parkingspot.GoogleMap.marker.setMap(null);
      google.maps.event.removeListener(parkingspot.GoogleMap.clickevent);
      parkingspotFactory.getParking_Map().delete(parkingspot_id);
    }
  }

  $scope.changeState = function (para_parkingspot) {
    $state.go('main.parkingspot', {parkingspot: para_parkingspot});
  };

  $scope.nextAddingStep = function () {
    $scope.openModal();
  }

  //Diese Funktion schließt alle Elemente, die für das Hinzufügen eines neuen Parkplatzes verwendet werden
  $scope.closeAdding = function () {
    $scope.closeModal();
    $scope.showAddParkinspot = true;
    google.maps.event.removeListener($scope.addingParkingspot.GoogleMap.clickevent);
    $scope.showFooter = false;
    $scope.addingParkingspot.GoogleMap.marker.setMap(null);// löscht den previewMarker von der map;
    $scope.addingParkingspot = null;
  }

  $scope.closeNavigation = function () {
    $scope.showNavigation = false
    $scope.directionsDisplay.setMap(null);
    $scope.showAddParkinspot = true;
  }

  $scope.addParkplatz = function () {
    parkingspotFactory.addParkingspotDatabse($scope.addingParkingspot, $scope.addMarker, $scope.closeAdding)
  }

  //Google Directions

  $scope.initialize = function () {
    {
      $scope.directionsService = new google.maps.DirectionsService();
      $scope.directionsDisplay = new google.maps.DirectionsRenderer({preserveViewport: true});
      $scope.directionsDisplay.setMap($scope.map);

    }
  }

  $rootScope.$on('eventCalcRoute', function (event, parkingspot) {
    $scope.calcRoute(parkingspot);
  })

  $rootScope.$on('addMarker', function (event, parkingspot) {
    $scope.addMarker(parkingspot);
  })

  $rootScope.$on('deleteMarker', function (event, parkingspot_id) {
    $scope.deleteParkingspot(parkingspot_id);
  })

  $rootScope.$on('updateUseronMap', function (event, user) {
    $scope.updateUseronMap(user);
  })

  $scope.calcRoute = function (parkingspot) {
    var request = {
      origin: {lat: parkingspotFactory.getUser().loc[0], lng: parkingspotFactory.getUser().loc[1]},
      destination: new google.maps.LatLng(parkingspot.data.loc[0], parkingspot.data.loc[1]),
      travelMode: 'DRIVING'
    }
    $scope.googlemapRoute = $scope.directionsService.route(request, function (result, status) {
      if (status == 'OK') {
        $scope.showNavigation = true;
        $scope.showAddParkinspot = false;
        $scope.directionsDisplay.setMap($scope.map);
        $scope.directionsDisplay.setDirections(result);
        $state.go('main.map');
      }
      else {
        console.log(status);
      }
    })
  }
});
