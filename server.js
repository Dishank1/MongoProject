/*
	Dishank Jhaveri, Salman Mustafa, Matthew Turczmanovicz
	Contemporary Databases
	Professor Holden
	April 1st, 2018
	Mongo Project
*/

//Attributes
const express = require('express');
const path = require('path');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const fs = require('fs');
const Grid = require('gridfs-stream');
const url = "mongodb://localhost:27017/MovieDatabase";
const app  = express();
var port = 8000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const db = new mongo.Db('MovieDatabase', new mongo.Server("127.0.0.1", 27017));
const gfs = Grid(db, mongo);
var dbo;

app.use(bodyParser.urlencoded({extended: true}));



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

//CORS
var cors = require('cors')

app.use(cors())

//Basic retrieval function
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

//Detailed retrieval function
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
    //To Do
    // var readstream = gfs.createReadStream({
    //
    //   _id: '5a9aec884ee50322d0351794'
    // });

    gfs.findOne({ tconst: 'tt0268978'}, function (err, file) {
      console.log(file);
    });
    // readstream.on("error", function(err) {
    //   console.log("Got error while processing stream " + err.message);
    //   res.end();
    // });
    // readstream.on("data", function(data) {
    //   console.log("reading data....");
    // });
    //
    // readstream.pipe(res);

});

//Ratings retrieval function
app.get("/ratingsSearch/:id", (req, res) => {
    var movieID = req.params.id;

    //Create query
    var query = {"tconst": movieID};

    //MongoDB query call
    dbo.collection("titleRatings").find(query).limit(1).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
        console.log(result);
    });

});

//Crew retrival function
app.get("/crewSearch/:id", (req, res) => {
    var movieID = req.params.id;

    //Create query
    var query = {"tconst": movieID};

    //MongoDB query call
    dbo.collection("titleCrew").find(query).limit(1).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
        console.log(result);
    });
});

//Principal retrival function
app.get("/principalSearch/:id", (req, res) => {
    var movieID = req.params.id;

    //Create query
    var query = {"tconst": movieID};

    //MongoDB query call
    dbo.collection("titlePrincipals").find(query).limit(20).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
        console.log(result);
    });
});

//Name search
app.get("/nameSearch/:id", (req, res) => {
    var personID = req.params.id;

    //Create query
    var query = {"nconst": personID};

    //MongoDB query call
    dbo.collection("nameBasics").find(query).limit(1).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
        console.log(result);
    });
});

//User Ratings function
app.get("/userRatings/:id", (req, res) => {
    var movieID = req.params.id;

    //Create query
    var query = {"tconst": movieID};

    //MongoDB query call
    dbo.collection("userRatings").find(query).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
        console.log(result);
    });

});

//User ratings post
app.post("/userRatings/", (req, res) => {

    dbo.collection("userRatings").save(req.body,(err,result) => {
        if (err) return console.log(err)

        console.log("saved to DB")
        res.redirect("back");
    })
    console.log(req.body);
});
