var request = require('request');
var cheerio = require('cheerio');
var pageLoader= require('./loadPage.js');

module.exports = {
	getEpisodes:getEpisodes,
	getEpisodesByUrl:getEpisodesByUrl
}

function getEpisodes($){
	return new Promise((resolve, reject) => {
		let episodes = {};
		if($('table').hasClass('episodes')){
			episodes = getEpisodesWhenSeUrl($);
		}else{
			episodes = getEpisodesWhenEpUrl($);
		}
		resolve(episodes);
	});
}

function getEpisodesWhenSeUrl($){ //Gets called when the craped link goes to the season site
	return new Promise((resolve, reject) => {
		let promisesArray = [];
		$('.episodes').find('tr').map(
		  	function(i, el) {
		  		let singlePromise = new Promise((resolve, reject) => {
			  		let episode = {};
				  	episode.nr = $(this).children().first().text();
				  	episode.DEName = $(this).children().next().children().first().children('strong').text();
				  	episode.ENName = $(this).children().next().children().first().children('span').text();
				  	episode.updateLink = 'https://bs.to/'+$(this).children().first().children().first().attr('href');

				  	let promisesArray2 = [];
				  	$(el).find('.icon').map(function(i2, ele) {
				  		let singlePromise2 = new Promise((resolve, reject) => {
					  		let upUrl = 'https://bs.to/'+$(ele).first().attr('href');
					  		let fakeUrl = {}

					  		pageLoader.getSite(upUrl).then(function($){
								fakeUrl = $('.hoster-player').attr('href');
								resolve({"bsUploadLink":upUrl,"fakeUrl":fakeUrl});
							});

							
						});
				  		promisesArray2.push(singlePromise2);
				  	}).get();
				  	Promise.all(promisesArray2).then((result2) => {
				  		episode.stream = result2;
				  		console.log('\x1b[31m',"Got ep:" + episode.nr);
					    resolve(episode);
					});
					
				});
				promisesArray.push(singlePromise);
			}
		).get()

		Promise.all(promisesArray).then((result) => {
		    //console.log(result);
		    resolve(result);
		});
	});
}

function getEpisodesWhenEpUrl($){ //Gets called when the craped link goes to the Episode or Uploader site
	
	return new Promise((resolve, reject) => {
		let promisesArray = [];
		$('.episodes').find('.epiInfo').map(
		  	function(i, el) {
		  		let singlePromise = new Promise((resolve, reject) => {
			  		let episode = {};
				  	episode.nr = i+1
					episode.DEName = $(this).children().first().text();
					episode.ENName = $(this).children().next().text();
					episode.updateLink = 'https://bs.to/'+$(this).children('.icon').attr('href');
					episode.latestCheck=	Date.now();

				  	let promisesArray2 = [];
				  	$(el).find('.icon').map(function(i2, ele) {
				  		let singlePromise2 = new Promise((resolve, reject) => {
					  		let upUrl = 'https://bs.to/'+$(ele).first().attr('href');
					  		let fakeUrl = {}

					  		pageLoader.getSite(upUrl).then(function($){
								fakeUrl = $('.hoster-player').attr('href');
								resolve({"bsUploadLink":upUrl,"fakeUrl":fakeUrl});
							});

							
						});
				  		promisesArray2.push(singlePromise2);
				  	}).get();
				  	Promise.all(promisesArray2).then((result2) => {
				  		episode.stream = result2;
				  		console.log('\x1b[31m',"Got ep:" + episode.nr);
					    resolve(episode);
					});
					
				});
				promisesArray.push(singlePromise);
			}
		).get()

		Promise.all(promisesArray).then((result) => {
		    //console.log(result);
		    resolve(result);
		});
	});
}

function getEpisodesByUrl(url){
  return new Promise((resolve, reject) => {
  	setTimeout(function() {
    request(url, function(error, response, html){
	  if(!error){
	  	var $ = cheerio.load(html);
	  	var epis = getEpisodes($);

	  	resolve($.html());
	  }
	});
	//resolve("epis");
	},(Math.random()*1000))
  });
}