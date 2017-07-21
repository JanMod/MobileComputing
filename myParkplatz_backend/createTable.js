/**
 * Created by janmoder on 11.07.17.
 */

var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://janmoder:moder123@cluster-shard-00-00-lyrrg.mongodb.net:27017,cluster-shard-00-01-lyrrg.mongodb.net:27017,cluster-shard-00-02-lyrrg.mongodb.net:27017/Cluster?ssl=true&replicaSet=Cluster-shard-0&authSource=admin"

MongoClient.connect(url, function (err, db){
    if(err) {
        console.log("No connection to database");
        return;
    }
    db.createCollection("myMarker", function (err, res) {
        if(err) throw err;
        console.log("Table-marker created");

        });
    db.collection("myMarker").createIndex( {loc : "2dsphere"}, function(err, res){
        if(err) throw  err;
        console.log("Index created")})
    db.close();
});