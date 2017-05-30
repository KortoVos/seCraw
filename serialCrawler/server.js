var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var analyse = require('./analyse.js');
var allSerials = require('./allSerials.js');

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  if(!err) {
    console.log("We are connected");
  }else{
    console.log("Error: could not connect to Mongo");
  }
});


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


app.listen(8081, function () {
  console.log('Example app listening on port 8081!');
});
