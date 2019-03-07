require('dotenv').config();

var bandsintown = require('bandsintown')('codingbootcamp');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var request = require('request');
var moment = require('moment');
var axios = require('axios');

var spotify = new Spotify(keys.spotify);

// node liri.js spotify-this-song '<song name here>'
if (process.argv[2] == 'spotify-this-song') {
	var song = process.argv[3];
	spotify.search({ type: 'track', query: song }).then(function(response) {
		var items = response.tracks.items;
		for (var i in items) {
			console.log('\n');
			console.log('Song:' , items[i].name);
			console.log('Artist:', items[i].artists[0].name);
			console.log('Album:', items[i].album.name);
			console.log('Preview:', items[i].preview_url);			
		}
	}).catch(function(err) {
		console.log(err);
  	});
}



// node liri.js concert-this '<artist name here>'
if (process.argv[2] == 'concert-this') {
	var artist = process.argv[3];
	var concerts = [];
	request('https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp', function (error, response, body) {
	    if (!error && response.statusCode == 200) {
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
	    }
	})
}

if (process.argv[2] == 'movie-this') {
	if (process.argv[3]){
		var input = '';
		for (var i=3; i<process.argv.length; i++){
			input = input + process.argv[i] + ' ';
		}
		input = input.trim();
		axios({
		  url:'http://www.omdbapi.com/?apikey=trilogy&t=' + input,
		  method:'GET'
		}).then(function(response) {
			logMovieData(response);
		});
	} else {
		axios({
		  url:'http://www.omdbapi.com/?apikey=trilogy&t=mr.nobody',
		  method:'GET'
		}).then(function(response) {
			logMovieData(response)
		});
	}
}


if (process.argv[2] == 'do-what-it-says') {
	
}

//utility functions

function logMovieData(res){
	console.log('Title:', res.data.Title);
	console.log('Year:', res.data.Year);
	console.log('IMDB Rating:', res.data.Ratings[0].Value);
	console.log('Rotten Tomatoes Rating:', res.data.Ratings[1].Value);
	console.log('Country:', res.data.Country);
	console.log('Language:', res.data.Language);
	console.log('Plot:', res.data.Plot);
	console.log('Actors:', res.data.Actors);
}

//not used
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








