/**
 * Created by janmoder on 07.07.17.
 */
var module = angular.module('app')


module.factory('parkingspotFactory', function ($http, $rootScope) {
    var parkplatzMap = new Map();
    var user = {
      username: "Admin",
      GoogleMap: {
        marker: "",
        circle: ""
      },
      loc: [],
      jwt: "",
      mapRadius: "1000"
    };

    console.log(parkplatzMap);
    return {
      getParking_Map: function () {
        return parkplatzMap;
      },
      getUser: function () {
        return user;
      },
      userDatachanged: function () {
        $rootScope.$emit('updateUseronMap', user);
      },
      getMarkerFromRegion: function () {
        _id = Array.from(parkplatzMap.keys());
        console.log("send ");
        console.log(_id);
        $http({
          method: 'GET',
          url: 'http://localhost:8080/marker',
          params: {
            parkingspots: JSON.stringify(_id),
            radius: user.mapRadius,
            loc: user.loc
          }
        }).then(function successCallback(response) {

          console.log("recieved")
          console.log(angular.copy(response.data));

          response.data.forEach(function (item) {

            if (item.actionFromServer == "deleting") {
              item.actionFromServer = "";
              $rootScope.$emit('deleteMarker', item._id);
              console.log("deleting request");
            }
            else if (item.actionFromServer == "adding") {
              console.log("adding request");
              item.actionFromServer = "";
              $rootScope.$emit('addMarker', item);
            }

          });
          $rootScope.$emit('onLoad');

        }, function errorCallback(response) {
          console.log("HTTP: Get all Marker error" + response);
        })
      },
      createParkingspotObject: function () {
        Parkingspot = {
          GoogleMap: {
            marker: "",
            clickevent: ""
          },
          type: "myMarker",
          actionFromServer: "",
          name: "",
          loc: [],
          price: "",
          others: "",
          spotMax: "",
          spotCurrent: "0",
          time: ""
        }
        return Parkingspot;
      },
      addParkingspotDatabse: function (parkingspot, addMarkerCallback, closeAddingCallback) {
        closeAddingCallback();
        parkingspot.GoogleMap.marker = "";
        parkingspot.GoogleMap.clickevent = "";
        $http.post('http://localhost:8080/setMarker', JSON.stringify(parkingspot)).then(function successCallback(response) {
          parkingspot._id = response.data;
          //  parkplatzMap.set(response.data, parkingspot);
          addMarkerCallback(parkingspot);

        }, function errorCallback(response) {
          closeAddingCallback();
          console.log("Not able to insert a parking spot into the  database");
        })
      },
      deleteParkingspotDatabase: function (parkingspot_id) {
        console.log(parkingspot_id);
        $http.delete('http://localhost:8080/deleteMarker/' + parkingspot_id).then(function successCallback(response) {
          console.log("Objected deleted from Database");
          $rootScope.$emit('deleteMarker', parkingspot_id);
        }, function errorCallback(response) {

          console.log("Not able to delete a this parking spot");
        })
      },
      calcRoute: function (parkingspot) {
        $rootScope.$emit('eventCalcRoute', parkingspot);
      }
    }

  }
)
