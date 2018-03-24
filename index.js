const express = require('express');
const path = require('path');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/MovieDatabase";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("MovieDatabase");
   dbo.collection("titleAKA").findOne({}, function(err, result) {
     if (err) throw err;
     console.log(result);
     db.close();
   });
});

const app  = express();

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));

app.listen(3000, () => console.log("Listening on 3000"));
