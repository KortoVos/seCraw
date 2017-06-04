var request = require('request');
var cheerio = require('cheerio');
module.exports = {
	getAllSerials:getAllSerials
}


function getAllSerials(url){
	return new Promise((resolve, reject) => {

		let promisesArray = [];
	  	var serials = {};
	  	console.log("Test123: "+url);
	    request(url, function(error, response, html){
		    if(!error){
		    	var $ = cheerio.load(html);

		    	$('#seriesContainer').find('a').map(
			  	function(i, el) {
			  		let singlePromise = new Promise((resolve, reject) => {
			  			let serial = {};
			  			serial.url 	="https://bs.to/"+$(this).attr("href");
	        			serial.title=$(this).text();
	        			serial.latestCheck=	Math.round(Math.random()*1000);
			  			resolve(serial);
			  		});
			  		promisesArray.push(singlePromise);
			  	});
			}
			Promise.all(promisesArray).then((result) => {
		    	console.log(result);
		    	resolve(result);
			});
		});
		
		
	});
}