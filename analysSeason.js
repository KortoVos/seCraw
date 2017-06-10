var request = require('request');
var cheerio = require('cheerio');
var episodes= require('./analysEpisodes.js');
var pageLoader= require('./loadPage.js');

module.exports = {
	getSeason:getSeason
}

function getSeason($){
	return new Promise((resolve, reject) => {
		var promisesArray = [];

	    var activSeason = 1;
		try{
			var activSeason = $('.active').children().first().attr("href").split('/')[2];
		}catch(err){}
	    $('#seasons').find('li').map(
	    	function(i, el) { 
				var singlePromise = new Promise((resolve, reject) => {
					var season = {};
					season.nr = $(this).text();
					season.latestCheck=	Date.now();
					season.updateLink = "https://bs.to/"+$(this).children().first().attr("href");
					if(activSeason == season.nr){

						episodes.getEpisodes($).then(function(result){
							season.episodes = result;
							console.log('\x1b[31m',"Got Season:" + season.nr);
							resolve(season);
						});
						
					}else{
						//resolve(season);
						pageLoader.getSite(season.updateLink).then(function(result){
							episodes.getEpisodes(result).then(function(result){
								season.episodes = result;

		    					console.log('\x1b[32m',"Got Season:" + season.nr);
								resolve(season);
							});
						});
					}
				});
			promisesArray.push(singlePromise);
	    	}
	    );

		Promise.all(promisesArray).then((result) => {
		    //console.log(result);
		    resolve(result);
		});
	});
}
