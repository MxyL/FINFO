/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var Firebase = require("firebase");
var fs = require('fs');
var csv = require("csv-parse");

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

app.get('/test', function (req, res) {
  // res.send('GET request to the homepage');
  data = parse();
  res.send(data);
});

function store(data) {
  var myDataRef = new Firebase('https://intense-fire-4574.firebaseio.com/');
  myDataRef.set(data)
}

function parse(data) {
 
  fs.readFile('./selection.csv', 'utf-8', function (err, data) {
    if (err) {
      return err; 
    }
    csv(data, function(err, output) {
      store(output);
    })
  });
}