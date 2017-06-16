module.exports = {
	getSite:getSite,
	getSiteSingleTry:getSiteSingleTry
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
			var https = require('https');
			var agent = new https.Agent({ maxSockets:1});
			var request = require('request');
			request({"url":url,"agent":agent}, function(error, response, html){
				url = null;
			    if(!error){
			    	//console.log('\x1b[32m',"request loaded:" + url);
			    	var cheerio = require('cheerio');
			    	var $ = cheerio.load(html);
			    	//console.log('\x1b[32m',"cheerio loaded:" + url);
			    	https = null;
			    	agent = null;
			    	request = null;
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

function getSiteSingleTry(url){
	return new Promise((resolve, reject) => {
		//console.log("request: "+url);
		var https = require('https');
		var agent = new https.Agent({ maxSockets : process.env.MAXSOCKETS });
		var request = require('request');
		request({"url":url,"agent":agent}, function(error, response, html){
			url = null;
		    if(!error){
		    	https = null;
		    	agent = null;
		    	request = null;
		    	resolve("$");
		    }else{
		    	console.warn(`Danger " ${url} " Danger!`);
		    }
		});
	});
}