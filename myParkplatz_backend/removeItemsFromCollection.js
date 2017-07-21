/**
 * Created by janmoder on 13.07.17.
 */


var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://janmoder:moder123@cluster-shard-00-00-lyrrg.mongodb.net:27017,cluster-shard-00-01-lyrrg.mongodb.net:27017,cluster-shard-00-02-lyrrg.mongodb.net:27017/Cluster?ssl=true&replicaSet=Cluster-shard-0&authSource=admin"

MongoClient.connect(url, function (err, db){
    if(err) {
        console.log("No connection to database");
        return;

    }

    db.collection("myMarker").remove({}, function(err, obj) {
        if (err) {
            throw err
        }
        else {
            console.log(obj.result.n + "items(s) has been deleted in collection : modul")
        }
    })
    db.close();
});