//Attributes
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
        console.log("All systems a go on port: " + port);
    });
});

//Search function
app.get("/search/:title", (req, res) => {
    var title = req.params.title; //Get the title being searched for
    var selector = {"primaryTitle": {$regex: ".*"+title+".", $options:"i"}};
    dbo.collection("titleBasics").find(selector).limit(20).sort({"startYear": -1}).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
        console.log(result);
    });
});