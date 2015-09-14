var express = require('express')
   ,cheerio = require('cheerio')
   ,path = require('path')
   ,jade = require('jade')
   ,fs = require('fs');

var app = express();
var port = process.env.PORT || 5000;
app.use("/public", express.static(path.join(__dirname, 'public')));
app.set('views', './views');
app.set('view engine', 'jade');

app.listen(port);

app.get('/:type/json', init_exam, all_tests, json_out);
app.get('/:type/rand/json', init_exam, random_test, json_out);
app.get('/:type/:q/json', init_exam, specific_test, json_out);

app.get('/', set_tech, random_test, out);

app.get('/:type/:q', init_exam, specific_test, single_out);

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

function specific_test(req, res, next) {
  res.stash = res.stash || {};
  res.stash.type = req.params.type;
  res.stash.q = req.params.q;

  res.stash.exam = require('./data/' + res.stash.type + '.json');

  res.stash.output = {};

  for(q in res.stash.exam) {
     console.log(res.stash.exam[q]);
     if(res.stash.q === res.stash.exam[q].question_no) {
       res.stash.output = res.stash.exam[q];
     }
  }

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

  res.render('rand', {});
}

function single_out(req, res) {
  res.stash = res.stash || {};

  res.render('one', {data: {class: res.stash.type, question: res.stash.q }});
}
