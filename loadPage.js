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
				//console.log("request: "+url);
				request({"url":url,"agent":global.agent}, function(error, response, html){
				    if(!error){
				    	//console.log('\x1b[32m',"request loaded:" + url);
				    	var $ = cheerio.load(html);
				    	//console.log('\x1b[32m',"cheerio loaded:" + url);

				    	resolve($);
				    }else{
				    	console.warn(`Danger " ${url} " Danger! ${tryNr} trys Remain!`);
				    	console.warn(error);
				    	getSiteMultiTry(url,tryNr-1).then(function(result){
				    		resolve(result);
				    	});
				    }
				});
		}else{
			console.error('Failed to Load!', error);
			resolve("");
		}
	});
}