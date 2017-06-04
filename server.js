var express = require('express'),
  fs = require('fs'),
  request = require('request'),
  cheerio = require('cheerio'),
  app     = express(),
  analyse = require('./analyse.js'),
  allSerials = require('./allSerials.js');

//var MongoClient = require('mongodb').MongoClient;


var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 80,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

/*
if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}
*/
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
  res.send("mongo test");
  console.log('Mongo is running on http://%s:%s', mongoURL, mongoURLLabel);
});

app.get('/pagecount', function (req, res) {
  res.send('{ pageCount: -1 }');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

var server = app.listen(port, ip, function () {
  console.log('Server is running on http://%s:%s', ip, port);
});


module.exports = app ;