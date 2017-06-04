var express = require('express'),
  fs = require('fs'),
  request = require('request'),
  cheerio = require('cheerio'),
  app     = express();
//var analyse = require('./analyse.js');
//var allSerials = require('./allSerials.js');

//var MongoClient = require('mongodb').MongoClient;


var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 80,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";



/*
app.get('/scrape', function(req, res){
  res.send("startet");
  search();
})

function search(){
    analyse.getSerial(data.rows[0].value).then(function(result){
        console.log("saved!");
        //search()

    }, err => {
      console.log("error while searching!");
    });
}

app.get('/getNewSerials', function(req, res){
  url = 'https://bs.to/andere-serien';
  
  allSerials.getAllSerials(url).then(function(result){
    //fs.writeFile('test.json', JSON.stringify(result, null, 4));
    res.json(result);
    result.map((el,i) => { 
      setTimeout(function() {
        console.log(el );
        couch.uniqid().then(function(ids){
          couch.insert(dbName,el)
        });
      },(Math.random()*10000))
    });

  });
})
*/

app.get('/', function (req, res) {
  res.send('4 Real ni?');
});

app.get('/pagecount', function (req, res) {
  res.send('{ pageCount: -1 }');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

var server = app.listen(port, ip, function () {
  console.log('Server running on http://%s:%s', ip, port);
});


module.exports = app ;