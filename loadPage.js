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
				console.log("request: "+url);
				request({"url":url,"agent":global.agent}, function(error, response, html){
				    if(!error){
				    	var $ = cheerio.load(html);
				    	console.log('\x1d[31m',"sucsesfully loaded:" + url);

				    	resolve($);
				    }else{
				    	console.warn(`Danger " ${url} " Danger! ${tryNr} trys Remain!`);
				    	console.warn(error);
				    	getSiteMultiTry(url,tryNr-1).then(function(result){
				    		resolve(result);
				    	});
				    }
				});
			},(Math.random()*process.env.WAITTIME))
		}else{
			console.error('Failed to Load!', error);
			resolve("");
		}
	});
}