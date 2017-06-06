var express = require('express'),
  fs = require('fs'),
  request = require('request'),
  cheerio = require('cheerio'),
  app     = express(),
  analyse = require('./analyse.js'),
  allSerials = require('./allSerials.js');

var searchMode = 0;

//var MongoClient = require('mongodb').MongoClient;


var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 80,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";


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

var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};


app.get('/scrape', function(req, res){
  res.send("startet");
  search();
})

function search(){
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
    col.find({}, {limit:1}).sort({latestCheck:1}).toArray(function(err, result) {
      try{
        console.log("searching: %s",JSON.parse(JSON.stringify(result[0].value)));
      }catch (err) {console.log("error: json object"); }
      try{
        try{
        console.log("searching: %s",JSON.parse(result[0]));
      }catch (err) {console.log("error: json2 object"); }

        console.log("searching length: %s",result.length);
      }catch (err) {console.log("error: length"); }
      try{
        console.log("searching url: %s",result[0].value.url);
      }catch (err) {console.log("error: url"); }
      try{
        console.log("searching url: %s",result[0]);
      }catch (err) {console.log("error: object"); }
      
      /*analyse.getSerial(result.rows[0].value).then(function(result){
          console.log("saved!");
          //search()

      }, err => {
        console.log("error while searching!");
      });*/
    });
  }else {
    res.send('Mongo connection error');
  }
}

app.get('/getNewSerials', function(req, res){
  url = 'https://bs.to/andere-serien';
  if (!db) {
    initDb(function(err){});
  }

  allSerials.getAllSerials(url).then(function(result){
    //fs.writeFile('test.json', JSON.stringify(result, null, 4));
    res.json(result);
    result.map((el,i) => { 
      setTimeout(function() {
        //console.log(el );
        var col = db.collection('serials');
        col.insert(el);
      },(Math.random()*10000))
    });

  });
})


app.get('/', function (req, res) {
  //res.send("mongo test");
  console.log('Mongo is running on http://%s  -  %s', mongoURL, mongoURLLabel);

  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ip: req.ip, date: Date.now()});

    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -2 }');
  }

});

app.get('/pagecount', function (req, res) {
    if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});


app.get('/serialsdb', function (req, res) {
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('serials').find({}).toArray(function(err, results){
      res.send(results); // output all records
    });
  } else {
    res.send('{connection error }');
  }
  
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

var server = app.listen(port, ip, function () {
  console.log('Server is running on http://%s:%s', ip, port);
});


module.exports = app ;