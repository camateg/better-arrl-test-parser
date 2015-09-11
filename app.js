var express = require('express')
   ,cheerio = require('cheerio')
   ,fs = require('fs');

var app = express();
var port = process.env.PORT || 5000;
app.listen(port);

app.get('/:type/json', init_exam, all_tests, json_out);
app.get('/:type/rand/json', init_exam, random_test, json_out);
app.get('/', set_tech, random_test, out);

app.get('/:type/rand', init_exam, random_test, out);

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function set_tech(req, res, next) {
  res.stash = res.stash || {};
  res.stash.type = 'tech';

  res.stash.exam = require('./data/' + res.stash.type + '.json');

  return next();
}

function init_exam(req, res, next) {
  res.stash = res.stash || {};
  res.stash.type = req.params.type;
 
  res.stash.exam = require('./data/' + res.stash.type + '.json'); 

  return next();
}

function random_test(req, res, next) {
  res.stash = res.stash || {};

  var idx = randomInt(0, res.stash.exam.length-1);

  res.stash.output = res.stash.exam[idx];

  return next();
}

function all_tests(req, res, next) {
  res.stash = res.stash || {};

  res.stash.output = res.stash.exam;  

  return next();
}

function json_out(req, res) {
  res.stash = res.stash || {};

  res.send(res.stash.output);
  res.end();
}


function out(req, res) {
  res.stash = res.stash || {};

  fs.readFile('views/one.html', function(err, data) {
    if (err) {
      console.log(err);
    }
    res.write(data);
    res.end();
  }); 
}
