/**
 * Created by janmoder on 11.07.17.
 */

var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://janmoder:moder123@cluster-shard-00-00-lyrrg.mongodb.net:27017,cluster-shard-00-01-lyrrg.mongodb.net:27017,cluster-shard-00-02-lyrrg.mongodb.net:27017/Cluster?ssl=true&replicaSet=Cluster-shard-0&authSource=admin"

MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log("No connection to database");
        return;
    }
    console.log("Server running");

    var parkplatzTable = db.collection("myMarker");
    var mongodb = require('mongodb');
    var cors = require("cors");
    var express = require('express');
    var bodyParser = require('body-parser');
    var app = express();
    app.use(cors());
    app.use(express.static('public'));
    app.use(bodyParser.json());
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        next();
    });


    app.get('/Marker', function (req, res) {
        var radius = parseFloat(req.query.radius)/1000;
        console.log(radius);
        console.log(req.query.parkingspots);
        var array_ids = JSON.parse(req.query.parkingspots);
        parkplatzTable.find({
            loc: {
                $geoWithin: {
                    $centerSphere: [[parseFloat(req.query.loc[0]), parseFloat(req.query.loc[1])],
                        radius / 6378.1]
                }
            }
        }).toArray(function (err, result) {
            if (!err) {
                res.send(compare(array_ids, result));
            }
        })
    });

// Der Client
    app.post('/setMarker', function (req, res) {
        parkplatzTable.insertOne(req.body, function (err, result) {
            if (err) throw err;
            console.log("Marker recieved from Client " + req.headers.host);
            res.send(result.insertedId);

        })
    });


    app.delete('/deleteMarker/:_id', function (req, res) {
        console.log(req.params._id);

        parkplatzTable.deleteOne({_id: new mongodb.ObjectID(req.params._id)}, function (err, obj) {
            if (err) throw err;
            else {
                res.send();
            }
        });
    })




    app.listen(8080);
});


compare = function (array1, array2) {
    console.log(array1.length);
    console.log(array1);
    if (array2.length === 0 && array1 != null) {
        var array = [];
        for (var i = 0; i < array1.length; i++) {
            parkingspotObj = new Object;
            parkingspotObj._id = array1[i];
            parkingspotObj.actionFromServer = "deleting";
            array.push(parkingspotObj);

        }
        console.log("empty array2");
        return array;
    }


    if (array1 != null) {
        var array = [];
        for (var i = 0; i < array1.length; i++) {
            parkingspotObj = new Object;
            parkingspotObj._id = array1[i];
            parkingspotObj.actionFromServer = "";
            array.push(parkingspotObj);
        }

        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array2.length; j++) {
                array2[j].actionFromServer = "adding";
                if (array[i]._id == array2[j]._id.toString()) {
                    console.log("ist gleich");
                    array.splice(i, 1);
                    array2.splice(j, 1);
                    if (array.length === 0) {
                        break;
                    }
                    j = -1;
                    i = 0;
                }

                if (array[i]._id != null) {
                    array[i].actionFromServer = "deleting";
                }

            }
        }
        for (var i = 0; i < array2.length; i++) {
            array2[i].actionFromServer = "adding";
        }
        return (array.concat(array2));
    }
    else {
        for (var i = 0; i < array2.length; i++) {
            array2[i].actionFromServer = "adding";
        }
        return array2;
    }
}