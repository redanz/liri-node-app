require('dotenv').config();

var bandsintown = require('bandsintown')('codingbootcamp');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var request = require('request');
var moment = require('moment');
var axios = require('axios');
var fs = require('fs');
var spotify = new Spotify(keys.spotify);


// node liri.js concert-this '<artist name here>'
if (process.argv[2] == 'concert-this') {
	if(process.argv[3]){
		var artist = combineStringsStartingIndex(process.argv, 3);
		concertsByArtist(artist);
	} else {
		concertsByArtist('skrillex');
	}
		
}

// node liri.js spotify-this-song '<song name here>'
if (process.argv[2] == 'spotify-this-song') {
	if(process.argv[3]){
		var song = combineStringsStartingIndex(process.argv, 3);
		spotifySong(song);
	} else {
		spotifySong('all the small things');
	}
	
}

// node liri.js movie-this '<movie name here>'
if (process.argv[2] == 'movie-this') {
	if (process.argv[3]) {
		var movie = combineStringsStartingIndex(process.argv, 3);
		logMovieData(movie)
	} else {
		logMovieData('mr.nobody');
	}
}

// node liri.js do-what-it-says
if (process.argv[2] == 'do-what-it-says') {
	var contents = fs.readFileSync('./random.txt', 'utf8');
	console.log(contents);
}


// api functions

function spotifySong(songName) {
	spotify.search({ type: 'track', query: songName }).then(function(response) {
		var items = response.tracks.items;
		for (var i in items) {	
			console.log('Song:' , items[i].name);
			console.log('Artist:', items[i].artists[0].name);
			console.log('Album:', items[i].album.name);
			console.log('Preview:', items[i].preview_url, '\n');
		}
	}).catch(function(err) {
		console.log(err);
  	});
}

function concertsByArtist(artist) {
	console.log(artist, 'upcoming concerts:')
	request('https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp', function (error, response, body) {
	    if (!error) {
			var info = JSON.parse(body);
			for (var i in info) {
				var venueName = info[i].venue.name;
				var venueLocation = info[i].venue.city + ', ' + info[i].venue.country;
				var date = info[i].datetime;
				
				console.log('\n');
				console.log('Venue:', info[i].venue.name);
				console.log('Location:', info[i].venue.city + ',', info[i].venue.country);
				console.log('Date:', moment(info[i].datetime).format('L'));
			}
	    } else {
	    	console.log(error);
	    }
	});
}

function logMovieData(movieName) {
	axios({
	  url:'http://www.omdbapi.com/?apikey=trilogy&t=' + movieName,
	  method:'GET'
	}).then(function(response) {
		console.log('Title:', response.data.Title);
		console.log('Year:', response.data.Year);
		console.log('IMDB Rating:', response.data.Ratings[0].Value);
		console.log('Rotten Tomatoes Rating:', response.data.Ratings[1].Value);
		console.log('Country:', response.data.Country);
		console.log('Language:', response.data.Language);
		console.log('Plot:', response.data.Plot);
		console.log('Actors:', response.data.Actors);
	});
}

// utility functions


// multiple word inputs e.g. 'the terminator'
function combineStringsStartingIndex(source, index){
	var input = '';
	for (var i=index; i<source.length; i++){
		input = input + source[i] + ' ';
	}
	return input.trim();
}

// removes duplicate elements from an array (not used)
function removeDuplicates(arr) {
	for (var i in arr) {
		var item = arr[i];
		for (var j=arr.length-1; j>i; j--) {
			if (arr[j] == item) {
				arr.splice(j, 1);
			}
		}
	}
	return arr;
}








