var express = require('express'),
  fs = require('fs'),
  request = require('request'),
  cheerio = require('cheerio'),
  app     = express(),
  https = require('https'),
  analyse = require('./analyse.js'),
  allSerials = require('./allSerials.js');

 require('dotenv').config()

var events = require('events');
var myEmitter = new events.EventEmitter();


var runScrape = true;

//var MongoClient = require('mongodb').MongoClient;
global.agent = new https.Agent({ maxSockets : process.env.MAXSOCKETS });


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
    dbDetails = new Object(),
    col = null;

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
    col = db.collection('serials');
    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};


app.get('/scrape', function(req, res){
  res.send("startet");
  runScrape = true;
  myEmitter.emit('scrapeSerial');
})

app.get('/stopscrape', function(req, res){
  res.send("stopping");
  runScrape = false;
})

setInterval(function() { 

    //console.log("setInterval: It's been 10 second!"); 
    console.log(process.memoryUsage());
    //global.gc();
    //console.log('\x1b[32m',process.memoryUsage());
  
  myEmitter.emit('scrapeSerial'); 
}, process.env.WAITTIME);


myEmitter.on('scrapeSerial', () => {
  //console.log('an event occurred! Next scrape will start!');
  if(runScrape){
    
    search();
  }
});

function search(){
  try{
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    col.find({}, {limit:1}).sort({latestCheck:1}).toArray(function(err, result) {
      //console.log("searching url2: %s",result[0].url);
      
      analyse.getSerial(result[0]).then(function(res){
        //console.dir(res);
        col.findAndModify(
          {_id: result[0]._id}, // query
          [['_id','asc']],  // sort order
          {$set: {
              latestCheck: res.latestCheck,
              description: res.description,
              genres:res.genres,
              release:res.release,
              actors:res.actors,
              producer:res.producer,
              director:res.director,
              author:res.author,
              img:res.img,
              seasons:res.seasons
            }
          }, // replacement, replaces only the field "hi"
          {}, // options
          function(err, object) {
            if (err){
              console.warn(err.message);  // returns error if no matching object found
            }else{
               //console.dir(object);

               //console.log("Added " + res._id)
               //console.log('\x1b[32m',"Added:" + res._id);
            }
            if(runScrape){
              //myEmitter.emit('scrapeSerial');
            }
          }
        );
      }, err => {
        console.log("error while searching!");
      });
    });
  }else {
    console.log('Mongo connection error');
  }
  }catch(err){
    console.log('\x1b[31m',"error grabbing:" + season.nr);
    console.log(err)
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
        col.insert(el);
      },(Math.random()*10000))
    });

  });
})


app.get('/', function (req, res) {
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var html = col.find({}).sort({latestCheck:1}).map(function(bje){
        return '<a href="'+bje.id+'"><div style="margin:4px;">' + bje.title + "</div></a>";
      });
    console.log(html);
    res.json("html");
    //res.send(JSON.stringify(html));
  }
});

app.get('/delAll', function (req, res) {
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    col.remove({},function(err, removed){
      res.send("dell all");
    });
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