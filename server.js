//Attributes
const express = require('express');
const path = require('path');
var MongoClient = require('mongodb').MongoClient;
var gfs = require('fs');
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
});//end connect

//static files
app.use(express.static(__dirname + '/'));
 
//CSS router
app.get('/index.css', function(req, res){ 
    res.send('/index.css'); res.end(); 
    }); //end router 

//Search function
app.get("/search/:title", (req, res) => {
    var title = req.params.title; //Get the title being searched for
    
    //Create the query
    var query = {"primaryTitle": {$regex: "\\b"+title+"\\b", $options:"i"}, "titleType": "movie", "isAdult": 0, "startYear": {$ne: "\\N"}, "runtimeMinutes": {$ne: "\\N"}, "genres": {$nin: ["\\N", "Documentary", "Music"]}};
    
    //MongoDB query call 
    dbo.collection("titleBasics").find(query).limit(10).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
        console.log(result);
    });
});//end search

//Detailed search function
app.get("/detailedSearch/:id", (req, res) => {
    var movieID = req.params.id; //Get the title being searched for
    
    //Create the query
    var query = {"tconst": movieID };
    
    //MongoDB query call
    dbo.collection("titleBasics").find(query).limit(1).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
        console.log(result);
    });
});

//Poster retrieval function
app.get("/images/:id", (req, res) => {

    
});

////Home
//app.get('*', function(req, res) {
//        res.sendfile('./index.html');
//    });//end home



