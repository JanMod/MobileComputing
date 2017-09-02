// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var module = angular.module('app', ['ionic', 'ngCordova'])

module.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

module.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('main', {
    url: '/main',
    abstract: true,
    templateUrl: 'templates/mainscreen.html'
  })

    .state('main.map', {
      url: "/map",
      views: {
        'map-tab': {
          templateUrl: "templates/map.html",
          controller: 'MapCtrl'
        }
      }
    })

    .state('main.parkingspot', {
      url: "/map/parkingspot",
      params: {
        parkingspot: null//Parkingspot als Parameter für changeState-Methode
      },
      views: {
        'map-tab': {
          templateUrl: "templates/screen/parking_spot.html",

        }
      }
    })
    .state('main.listparkingspot', {
      url: "/list/parkingspot",
      params: {
        parkingspot: null//Parkingspot als Parameter für changeState-Methode
      },
      views: {
        'list-tab': {
          templateUrl: "templates/screen/parking_spot.html",
        }
      }
    })

    .state('main.list', {
      url: "/history",
      views: {
        'list-tab': {
          templateUrl: "templates/list.html",
          controller: 'ListCtrl'
        }
      }
    })

    .state('main.settings', {
      url: "/settings",
      views: {
        'settings-tab': {
          templateUrl: "templates/settings.html",
          controller: 'SettingsCtrl'
        }
      }
    })


  $urlRouterProvider.otherwise("/main/map");

});

module.config(['$ionicConfigProvider', function ($ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('top'); // Tabs befinden sich im unteren Berreich
}]);
