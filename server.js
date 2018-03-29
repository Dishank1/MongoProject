//Attributes
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var MongoClient = require('mongodb').MongoClient;
var gfs = require('fs');
var url = "mongodb://localhost:27017/MovieDatabase";
const app  = express();
var port = 8000;
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

    //dbo.collection("userRatings").save(req.body,(err,result) => {
        //if (err) return console.log(err)

        //console.log("saved to DB")
        //res.redirect("/");    
    //})
    console.log(req.body);    
});


