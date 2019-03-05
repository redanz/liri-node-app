require('dotenv').config();

var Spotify = require('node-spotify-api');
var keys = require('./keys.js');

var spotify = new Spotify(keys.spotify);

// node liri.js spotify-this-song '<song name here>'


if (process.argv[2] == 'spotify-this-song'){

	var song = process.argv[3];
	var songs = [];
	spotify.search({ type: 'track', query: song }).then(function(response) {
		var items = response.tracks.items;
		// console.log(items[0])
		for (var i in items){
			var song = items[i].name;
			var artist = items[i].artists[0].name;
			var album = items[i].album.name;

			songs.push({
				song: song,
				artist: artist,
				album: album
			})
		}
		console.log(songs);
	}).catch(function(err) {
		console.log(err);
  	});
}

function removeDuplicates(arr){
	for (var i in arr){
		var item = arr[i];
		for (var j=arr.length-1; j>i; j--){
			if (arr[j] == item){
				arr.splice(j, 1);
			}
		}
	}
	return arr;
}

// if (process.argv[2] == 'spotify-this-song'){
	
// }

// if (process.argv[2] == 'movie-this'){
	
// }

// if (process.argv[2] == 'do-what-it-says'){
	
// }


// var contents = fs.readFileSync('./keys.js', 'utf8', function(err, data){
// 	var spotify = new Spotify(keys.spotify);
// 	console.log(spotify);
// });

