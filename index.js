"use strict";

//Global Variables
var titleBasicsData;
var titleRatingsData;
var titlePrincipalsData;
var titleCrewData;
var nameBasicsData;
var userRatingsData;

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
    
    var detailedDataURL = "http://localhost:8000/detailedSearch/" + cleanedMovieID;
    console.log(detailedDataURL);
    
    var ratingsDataURL = "http://localhost:8000/ratingsSearch/" + cleanedMovieID;
    console.log(ratingsDataURL);
    
    var crewDataURL = "http://localhost:8000/crewSearch/" + cleanedMovieID;
    console.log(crewDataURL);
    
    var principalDataURL = "http://localhost:8000/principalSearch/" + cleanedMovieID;
    console.log(principalDataURL);

    var userRatingsDataURL = "http://localhost:8000/userRatings/" + cleanedMovieID;
    console.log(userRatingsDataURL);
    
    //Call the API
    //Detailed Data
    $.ajax({
        type: 'GET',
        data: null,
        dataType: 'json',
        url: detailedDataURL,
        success: detailedDataLoaded,     
    });
    //Ratings Data
    $.ajax({
        type: 'GET',
        data: null,
        dataType: 'json',
        url: ratingsDataURL,
        success: ratingsDataLoaded,     
    });
    //Crew Data
    $.ajax({
        type: 'GET',
        data: null,
        dataType: 'json',
        url: crewDataURL,
        success: crewDataLoaded,     
    });
    //Principals Data
    $.ajax({
        type: 'GET',
        data: null,
        dataType: 'json',
        url: principalDataURL,
        success: principalDataLoaded,     
    });
    //User ratings Data
    $.ajax({
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
    createDetailedContent();
}

function ratingsDataLoaded(result) {
    console.log("Ratings Data Loaded");
    titleRatingsData = result;
    console.log(titleRatingsData);
    createDetailedContent();
}

function crewDataLoaded(result) {
    console.log("Crew Data Loaded");
    titleCrewData = result;
    console.log(titleCrewData);
    createDetailedContent();
}

function principalDataLoaded(result) {
    console.log("Principal Data Loaded");
    titlePrincipalsData = result;
    console.log(titlePrincipalsData);
    createDetailedContent();
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
                    movieDirector = titleCrewData[0].directors;
                }
                if (!titleCrewData[0].writers) {
                    movieWriter = "Writers(s) Not Available"
                }
                else {
                    movieWriter = titleCrewData[0].writers;
                }
                
                detailedMovieString += "<p>Director(s): " + movieDirector + "</p><p>Writer(s): " + movieWriter + "</p></div>";
            }
            
            var singlePrincipalsString = "<div>";
            
            //Not Working Too Well
//            //Principals Data
//            if (titlePrincipalsData != null && titlePrincipalsData.length > 0) {
//                for (var j = 0; j < titlePrincipalsData.length; j++) {
//                    if (!titlePrincipalsData[i].category) {
//                        moviePrincipalRole = "Role Unknown";
//                    }
//                    else {
//                        moviePrincipalRole = titlePrincipalsData[i].category;
//                    }
//                    if (!titlePrincipalsData[i].nconst) {
//                        moviePrincipalName = "Unknown";
//                    }
//                    else {
//                        moviePrincipalName = titlePrincipalsData[i].nconst;
//                    }
//                    
//                    singlePrincipalsString += "<p>" + moviePrincipalRole + " - " + moviePrincipalName + "</p>";
//                }
//                
//                singlePrincipalsString += "</div>";
//                detailedMovieString += singlePrincipalsString;
//            }
            
            
            

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