var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var analyse = require('./analyse.js');
var allSerials = require('./allSerials.js');
const NodeCouchDb = require('node-couchdb');
const couch = new NodeCouchDb({
    auth: {
        user: 'korto',
        pass: 'qwer1234'
    }
});

const dbName = 'serials';
const viewUrl = '_design/nextUpdate/_view/nextUpdate?limit=1'

couch.listDatabases().then(dbs => {
    //console.log(dbs);

});

app.get('/scrape', function(req, res){
  res.send("startet");
  search();
})

function search(){
  couch.get(dbName, viewUrl).then(({data, headers, status}) => {
    //res.json(data.rows[0].value);
    console.log("Start: "+data.rows[0].value.title);
    analyse.getSerial(data.rows[0].value).then(function(result){
      couch.update(dbName, result).then(({data, headers, status}) => {
        console.log("saved!");
        search()
      }, err => {
      });
    }, err => {
    });
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
