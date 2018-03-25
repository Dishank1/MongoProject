"use strict";

//Global Variables
var titleBasicsData;
var titleRatingsData;
var titlePrincipalsData;
var titleCrewData;
var nameBasicsData;

//Initialize once the page loads
window.onload = init;

//Initialize Function
function init() {
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
        var movieYear
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
            var singleMovieString = "<div id='"+movieID+"'><button onclick='getDetailedMovieData(this)' id='"+movieID+"'>" + movieTitle + " | " + movieYear + "</button></div><br />";
            
            //Add this specific title to the complete string
            moviesString += singleMovieString;
        }
        
        //Display results
        moviesString += "</div>";
        dynamicContent.innerHTML = moviesString;
    }
}

function getDetailedMovieData(movie) {
    var cleanedMovieID = movie.id.trim();
    cleanedMovieID = encodeURI(cleanedMovieID);
    
    var url = "/detailedSearch/"+cleanedMovieID;
    
    callAPIDetailedData(url);
}

//Call our API and hopefully get data - detailed movie data
function callAPIDetailedData(searchedValue) {
    var completeURL = "http://localhost:8000" + searchedValue;
    console.log(completeURL);
    
    //Call the API
    $.ajax({
        type: 'GET',
        data: null,
        dataType: 'json',
        url: completeURL,
        success: detailedDataLoaded,     
    });
}

function detailedDataLoaded(result) {
    console.log("Detailed Data Loaded");
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
        var movieOriginalTitle;
        var movieYear
        var movieGenres;
        var movieRuntime;
        var movieSynopsis;
        var movieSynopsisAuthor;
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
                movieSynposis = "Film Synposis Not Available";
            }
            else {
                movieSynopsis = allMovies[i].synopsis;
            }
            
            //Film Synposis Author
            if (!allMovies[i].synopsisAuthor) {
                movieSynposisAuthor = "Author Not Available";
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
            var singleMovieString = "<div id='"+movieTitle+"'><h4>" + movieTitle + "</h4><p>Original Title: " + movieOriginalTitle + "</p><p>Release Year: " + movieYear + "</p><p>Genre(s): " + movieGenres + "</p><p>Runtime: " + movieRuntime + " minutes</p><p>Synopsis: " + movieSynopsis + " - " + movieSynopsisAuthor + "</p></div><br />";
            
            //Add this specific title to the complete string
            moviesString += singleMovieString;
        }
        
        //Display results
        moviesString += "</div>";
        dynamicContent.innerHTML = moviesString;
    }
    
}