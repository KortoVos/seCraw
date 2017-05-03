var request = require('request');
var cheerio = require('cheerio');

module.exports = {
	getSite:getSite
}

function getSite(url){
	return new Promise((resolve, reject) => {
		getSiteMultiTry(url,10).then(function(result){
			resolve(result);
		});
	});
}

function getSiteMultiTry(url,tryNr){
	return new Promise((resolve, reject) => {
		if(tryNr > 0){
			setTimeout(function() {
				request(url, function(error, response, html){
				    if(!error){
				    	var $ = cheerio.load(html);
				    	
				    	resolve($);
				    }else{
				    	console.warn(`Danger ${url}! Danger! ${tryNr} trys Remain!`);
				    	getSiteMultiTry(url,tryNr-1).then(function(result){
				    		resolve(result);
				    	});
				    }
				});
			},(Math.random()*1000))
		}else{
			console.error('Failed to Load!', error);
			resolve("");
		}
	});
}