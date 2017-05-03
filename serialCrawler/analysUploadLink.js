var cheerio = require('cheerio');
module.exports = {
	getUploadLink:getUploadLink
}

function getUploadLink($){
	let upLink = {};
	if($('table').hasClass('episodes')){
		upLink = getUploadLinkWhenSeUrl($);
	}else{
		upLink = getUploadLinkWhenEpUrl($);
	}
	return upLink;
}


function getUploadLinkWhenSeUrl($){ //Gets called when the craped link goes to the season site
	return(
		$('.episodes').find('tr').map(
		  	function(i, el) {
		  		let episode = {};
			  	episode.nr = $(this).children().first().text();
			  	episode.latestCheck=Date.now();
			  	episode.DEName = $(this).children().next().children().first().children('strong').text();
			  	episode.ENName = $(this).children().next().children().first().children('span').text();
			  	episode.updateLink = 'https://bs.to/'+$(this).children().first().children().first().attr('href');
			  	episode.upLink = updateLink.getUploadLink($);
				return episode;
			}
		).get()
	);
}

function getUploadLinkWhenEpUrl($){ //Gets called when the craped link goes to the Episode or Uploader site
	return(
		$(this).find('.v-centered').map(
		  	function(i, el) {
			  	let upLink = {};
				//upLink.url = .attr('href');
			  	return upLink;
			}
		).get()
	);
}