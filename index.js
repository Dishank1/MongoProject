/*
	Dishank Jhaveri, Salman Mustafa, Matthew Turczmanovicz
	Contemporary Databases
	Professor Holden
	April 1st, 2018
	Mongo Project
*/

"use strict";

//Global Variables
var titleBasicsData;
var titleRatingsData;
var titlePrincipalsData;
var titleCrewData;
var nameBasicsData;
var userRatingsData;
var allDirectors;
var allWriters;
var writerList = "";
var directorList= "";

//Initialize once the page loads
window.onload = init;

//Initialize Function
function init() {
    document.getElementById("logoDiv").addEventListener('click',function(){location.href = 'http://127.0.0.1:8000/index.html'},false);
    document.getElementById("searchButton").onclick = searchMovies;

}

//When the user searches for movie titles, we will call our API and retrieve data on the movie they searched for
function searchMovies() {
    var searchValue = document.getElementById("searchText").value;
    var cleanedSearchValue = searchValue.trim();

    if (cleanedSearchValue.length < 1) {
        document.getElementById("dynamicContent").innerHTML = "<h4>Please Enter A Movie Title</h4>";
    }
    else {
        document.getElementById("dynamicContent").innerHTML = "<h4>Finding Films...</h4>";
        cleanedSearchValue = encodeURI(cleanedSearchValue);

        //Create the URL we are going to call the API with
        var url = "/search/"+cleanedSearchValue;

        //Call the API - function
        callAPIBasicData(url);
    }
}

//Call our API and hopefully get data - basic movie data
function callAPIBasicData(searchedValue) {
    var completeURL = "http://localhost:8000" + searchedValue;
    console.log(completeURL);

    //Call the API
    $.ajax({
        type: 'GET',
        data: null,
        dataType: 'json',
        url: completeURL,
        success: basicDataLoaded,
    });
}

//We have made a call to the API and hopefully got some data on the films they searched for
function basicDataLoaded(result) {
    console.log("Loaded Basic Data");
    var dynamicContent = document.getElementById("dynamicContent");
    titleBasicsData = result;
    console.log(titleBasicsData);

    //Error handling
    if (titleBasicsData == null || titleBasicsData.length < 1) {
        dynamicContent.innerHTML = "<h4>No Results Found</h4>";
    }
    //Valid data retrieved
    else if (titleBasicsData != null && titleBasicsData.length > 0) {
        //Variables
        var allMovies = titleBasicsData;
        var movieTitle;
        var movieYear;
        var moviesString;
        var movieID;

        moviesString = "<div id='movies'>";

        for (var i = 0; i < allMovies.length; i++) {

            //Film Title
            if (!allMovies[i].primaryTitle) {
                movieTitle = "Film Title Not Available";
            }
            else {
                movieTitle = allMovies[i].primaryTitle;
            }

             //Film Year
            if (!allMovies[i].startYear) {
                movieYear = "Film Year Not Available";
            }
            else {
                movieYear = allMovies[i].startYear;
            }


            //Film ID
            if (!allMovies[i].tconst) {
                movieID = null;
            }
            else {
                movieID = allMovies[i].tconst;
            }

            //Add all of the basic information for this movie to a sting
            var singleMovieString = "<div id='"+movieID+"'><button onclick='callAPIDetailedData(this)' id='"+movieID+"'>" + movieTitle + " | " + movieYear + "</button></div><br />";

            //Add this specific title to the complete string
            moviesString += singleMovieString;
        }

        //Display results
        moviesString += "</div>";
        dynamicContent.innerHTML = moviesString;
    }
}

//Call our API and hopefully get data
function callAPIDetailedData(searchedMovie) {
    var cleanedMovieID = searchedMovie.id.trim();
    cleanedMovieID = encodeURI(cleanedMovieID);
    directorList = "";
    writerList = "";
    getDetailsData(cleanedMovieID)
    .then(getRatingsData.bind(null,cleanedMovieID))
    .then(getCrewData.bind(null,cleanedMovieID))
    .then(getUserRatingsData.bind(null,cleanedMovieID))
    .then(function(){
        var writerArray  = titleCrewData[0].writers.split(",");

        return writerArray.map((writer) => getName(writer));
    })
    .then(function(){
        var directorArray  = titleCrewData[0].directors.split(",");
         return directorArray.map((director) => getName(director,true));
    })
    .then(function(data){
      allDirectors = data;
    })
    .then(function(){
      //global object detailedData has all updated values
      //update UI
      setTimeout(function(){

          createDetailedContent();
        console.log("calledMe ");

 }, 2000);

    })

}

function getCrewData(cleanedMovieID) {
  var crewDataURL = "http://localhost:8000/crewSearch/" + cleanedMovieID;

return  $.ajax({
      type: 'GET',
      data: null,
      dataType: 'json',
      url: crewDataURL,
      success: crewDataLoaded,
  });
}

function getRatingsData(cleanedMovieID) {

  var ratingsDataURL = "http://localhost:8000/ratingsSearch/" + cleanedMovieID;
  console.log(ratingsDataURL);

  return $.ajax({
      type: 'GET',
      data: null,
      dataType: 'json',
      url: ratingsDataURL,
      success: ratingsDataLoaded,
  });
}

function getDetailsData(cleanedMovieID){
  var detailedDataURL = "http://localhost:8000/detailedSearch/" + cleanedMovieID;
  console.log(detailedDataURL);

  return $.ajax({
      type: 'GET',
      data: null,
      dataType: 'json',
      url: detailedDataURL,
      success: detailedDataLoaded,
  });
}

function getUserRatingsData(cleanedMovieID){
  var userRatingsDataURL = "http://localhost:8000/userRatings/" + cleanedMovieID;
  console.log(userRatingsDataURL);

  return $.ajax({
      type: 'GET',
      data: null,
      dataType: 'json',
      url: userRatingsDataURL,
      success: userRatingsDataLoaded,
  });
}

function detailedDataLoaded(result) {
    console.log("Detailed Data Loaded");
    titleBasicsData = result;
    console.log(titleBasicsData);
}

function ratingsDataLoaded(result) {
    console.log("Ratings Data Loaded");
    titleRatingsData = result;
    console.log(titleRatingsData);
}

function crewDataLoaded(result) {
    console.log("Crew Data Loaded");
    titleCrewData = result;

    console.log(titleCrewData);
}

function getName(nconst,isDirector) {
  var nameDataURL = "http://localhost:8000/nameSearch/" + nconst;
  console.log(nameDataURL);
return   $.ajax({
          type: 'GET',
          data: null,
          dataType: 'json',
          url: nameDataURL,
          success: function (result) {
            if(isDirector){
              if(result[0].primaryName !="undefined"){
                directorList += " " +result[0].primaryName;
            }else{
              directorList = " "
            }
            }else{
              if(result[0].primaryName !="undefined"){
            writerList += " "+ result[0].primaryName;
          }else{
            writerList = " "
          }
            }

          },
        });
}


function userRatingsDataLoaded(result) {
    console.log("User Ratings Data Loaded");
    userRatingsData = result;
    console.log(userRatingsData);
    createDetailedContent();
}

function createDetailedContent() {

    //Movie Data
    //Error handling
    if (titleBasicsData == null || titleBasicsData.length < 1) {
        dynamicContent.innerHTML = "<h4>No Results Found</h4>";
    }

    //Valid data retrieved
    else if (titleBasicsData != null && titleBasicsData.length > 0) {
        //Variables
        var allMovies = titleBasicsData;
        var allUserRatings = userRatingsData;
        var movieTitle;
        var movieOriginalTitle;
        var movieYear
        var movieGenres;
        var movieRuntime;
        var movieSynopsis;
        var movieSynopsisAuthor;
        var movieRating;
        var movieRatingVotes;
        var movieDirector;
        var movieWriter;
        var moviePrincipalRole;
        var moviePrincipalName;
        var moviesString;
        var movieID;
        var movieRatingComments;
        var userRatingName;

        moviesString = "<div id='movies'>";

        for (var i = 0; i < allMovies.length; i++) {

            //Film Title
            if (!allMovies[i].primaryTitle) {
                movieTitle = "Film Title Not Available";
            }
            else {
                movieTitle = allMovies[i].primaryTitle;
            }

            //Original Title
            if (!allMovies[i].originalTitle) {
                movieOriginalTitle = "Original Film Title Not Available";
            }
            else {
                movieOriginalTitle = allMovies[i].originalTitle;
            }

            //Film Year
            if (!allMovies[i].startYear) {
                movieYear = "Film Year Not Available";
            }
            else {
                movieYear = allMovies[i].startYear;
            }

            //Film Genres
            if (!allMovies[i].genres) {
                movieGenres = "Film Genres Are Not Available";
            }
            else {
                movieGenres = allMovies[i].genres;
            }

            //Film Runtime
            if (!allMovies[i].runtimeMinutes) {
                movieRuntime = "Film Runtime Not Available";
            }
            else {
                movieRuntime = allMovies[i].runtimeMinutes;
            }

            //Film Synposis
            if (!allMovies[i].synopsis) {
                movieSynopsis = "Film Synposis Not Available";
            }
            else {
                movieSynopsis = allMovies[i].synopsis;
            }

            //Film Synposis Author
            if (!allMovies[i].synopsisAuthor) {
                movieSynopsisAuthor = "Author Not Available";
            }
            else {
                movieSynopsisAuthor = allMovies[i].synopsisAuthor;
            }

            //Film ID
            if (!allMovies[i].tconst) {
                movieID = null;
            }
            else {
                movieID = allMovies[i].tconst;
            }

            //Add all of the basic information for this movie to a sting
            var detailedMovieString = "<div id='"+movieTitle+"'><h4>" + movieTitle + "</h4><p>Original Title: " + movieOriginalTitle + "</p><p>Release Year: " + movieYear + "</p><p>Genre(s): " + movieGenres + "</p><p>Runtime: " + movieRuntime + " minutes</p><p>Synopsis: " + movieSynopsis + " - " + movieSynopsisAuthor + "</p>";

            //Ratings Data
            if (titleRatingsData != null && titleRatingsData.length > 0) {

                if (!titleRatingsData[0].averageRating) {
                    movieRating = "Rating Not Available";
                }
                else {
                    movieRating = titleRatingsData[0].averageRating;
                }
                if (!titleRatingsData[0].numVotes) {
                    movieRatingVotes = "Votes on Rating Not Available";
                }
                else {
                    movieRatingVotes = titleRatingsData[0].numVotes;
                }

                detailedMovieString += "<p>Rating: " + movieRating + "/10 - " + movieRatingVotes + " votes.</p>";
            }

            //Crew Data
            if (titleCrewData != null && titleCrewData.length > 0) {
                if (!titleCrewData[0].directors) {
                    movieDirector = "Director(s) Not Available";
                }
                 else {


                movieDirector = allDirectors;

                  //  movieDirector = titleCrewData[0].directors;
                }
                if (!titleCrewData[0].writers) {
                    movieWriter = "Writers(s) Not Available";
                    console.log("no writer")
                }
                else {
                  console.log("allWRITTERS" + allWriters);



                     movieWriter = allWriters;
                }

                detailedMovieString += "<p>Director(s): " + directorList + "</p><p>Writer(s): " + writerList + "</p></div>";


            //User Ratings input
            detailedMovieString += '<div class = "eachUserRating"><form action="/userRatings" method="POST">Name:<br><input type="hidden" name="tconst" value=' + movieID + '><input name="name" type="text" style="width: 20%"/><br>Rating:<br><input type="radio" name="stars" value="1"><input type="radio" name="stars" value="2"><input type="radio" name="stars" value="3"><input type="radio" name="stars" value="4"><input type="radio" name="stars" value="5"><br>Comments:<br><textarea name="comment" >Enter comment here...</textarea><br><button type="submit">Submit</button></form>';


            //User Ratings Data
            if (userRatingsData != null && userRatingsData.length > 0) {
                for(var x = 0; x < allUserRatings.length; x++) {

                    if (!allUserRatings[x].stars) {
                        movieRating = "Rating Not Available";
                    }
                    else {
                        movieRating = userRatingsData[x].stars;
                    }
                    if (!allUserRatings[x].comment) {
                        movieRatingComments = "Comments on Movie Not Available";
                    }
                    else {
                        movieRatingComments = userRatingsData[x].comment;
                    }
                    if (!allUserRatings[x].name) {
                        userRatingName = "User name Not Available";
                    }
                    else {
                        userRatingName = allUserRatings[x].name;
                    }

                    detailedMovieString += "<div class = 'eachUserRating'><p>User Name: " + userRatingName + "</p><p>User Rating: " + movieRating + "/5 " + "</p><p>User Comment: " + movieRatingComments + " </p></div>";
                }
        }

            //Add this specific title to the complete string
            moviesString += detailedMovieString;
        }
        //Display results
        moviesString += "</div>";
        dynamicContent.innerHTML = moviesString;
    }
  }

}
