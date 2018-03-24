//attributes
const express = require('express');
const path = require('path');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/MovieDatabase";
const app  = express();
var port = 8000;
var dbo;

//Connect to MongoDB and start the server
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    dbo = db.db("MovieDatabase");
    app.listen(port, () => {
        console.log("Listening on " + port);
    });
});

//Search function
app.get("/search/:title", (req, res) => {
    var title = req.params.title; //Get the title being searched for
    dbo.collection("titleBasics").findOne({"primaryTitle": title }, function(err, result) {
        if (err) throw err;
        res.send(result);
        console.log(result);
    });
});

//app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));


//   dbo.collection("titleAKA").findOne({}, function(err, result) {
//     if (err) throw err;
//     console.log(result);
//     db.close();
//   });