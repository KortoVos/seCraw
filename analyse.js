var request = require('request');
var cheerio = require('cheerio');
var seasons = require('./analysSeason.js');
module.exports = {
	getSerial:getSerial
}

function getSerial(serial){
	return new Promise((resolve, reject) => {
		var pageLoader= require('./loadPage.js');
		pageLoader.getSite(serial.url).then(function(result){
			var data = $(result);
			result = null;
			//global.gc();
			//console.log("Page loaded");
			serial.latestCheck=	Date.now();
	        serial.title 	  =data.children().first().text().match('\\t(.*?)\\n')[0].trim(); 
	        serial.description="Wunderbare beschreibung";  
	        serial.genres 	  ="bestes Genre"; 
	        //var release = data.children().next().next().children().next().html().match('<em>(.*?) - (.*?)</').splice(1,2);
	        serial.release  = {"start":"2004","end":"2009"}

			resolve(serial);
		});


		//console.log("start with Serial:");
		//console.dir(serial._id);
        
	});
}

/*
function getSerial(serial){
	return new Promise((resolve, reject) => {
		console.log("start with Serial:");
		console.dir(serial._id);
  	//var serial = {};
    request(serial.url, function(error, response, html){
	    if(!error){
	    	var $ = cheerio.load(html);
	    	$('#sp_left').filter(function(){ 
	        var data = $(this);
	        serial.latestCheck=	Date.now();
	        //serial.url 			=		url;
	        serial.title 		= 	data.children().first().text().match('\\t(.*?)\\n')[0].trim(); 
	        serial.description =data.children().next().children().html();  
	        serial.genres 	= 	data.children().next().next().children().children().next().html().split('</span>').map(obj=>obj.split('>')[1]).filter((obj)=>obj != null); 
	        var release = data.children().next().next().children().next().html().match('<em>(.*?) - (.*?)</').splice(1,2);
	        serial.release  = {"start":release[0],"end":release[1]}
	        serial.actors 	= 	data.children().next().next().children().next().next().children().next().html().split('>').filter(o=>o.match(("(.*?),</span|</span"))).map(o=>o.split(',')[0]).map(o=>o.split('<')[0]);
	        serial.producer = 	data.children().next().next().children().next().next().next().children().next().html().split('>').filter(o=>o.match(("(.*?),</span|</span"))).map(o=>o.split(',')[0]).map(o=>o.split('<')[0]);
	        serial.director = 	data.children().next().next().children().next().next().next().next().children().next().html().split('>').filter(o=>o.match(("(.*?),</span|</span"))).map(o=>o.split(',')[0]).map(o=>o.split('<')[0]);
	        serial.author 	=   data.children().next().next().children().next().next().next().next().next().children().next().html().split('>').filter(o=>o.match(("(.*?),</span|</span"))).map(o=>o.split(',')[0]).map(o=>o.split('<')[0]);
		    });
		    $('#sp_right').filter(function(){ 
	        var data = $(this);
	        serial.img = data.children().first().attr("src");
			  })
		    
			  //seasons.getSeason($).then(function(result){
			  //  serial.seasons = result;
			    resolve(serial);
			  //});
			}
		});
		
	});
}
*/