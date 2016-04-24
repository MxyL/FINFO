/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var Firebase = require("firebase");
var parsers = require("./parsers");
var cors = require('cors');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.use(cors());
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

var firebase = new Firebase('https://finfo1.firebaseio.com/');

app.get('/test', function (req, res) {
  // res.send('GET request to the homepage');
  data = parse();
  res.send(data);
});

app.get('/upload', function(req, res) {
  parsers.parseOperations();
  res.send('GET request to the homepage');
});

app.get("/catch", function(req, res) {
  var ref = firebase.child("catch");
  if (req.query.filter) {
    if (req.query.filter.indexOf(">=") >= 0) {
      ref = ref.orderByChild(req.query.filter.split(">=")[0]).startAt(req.query.filter.split(">=")[1]);
    } else if (req.query.filter.indexOf("<=") >= 0) {
      ref = ref.orderByChild(req.query.filter.split("<=")[0]).endAt(req.query.filter.split("<=")[1]);
    } else if (req.query.filter.indexOf("=") >= 0) {
      ref = ref.orderByChild(req.query.filter.split("=")[0]).equalTo(req.query.filter.split("=")[1]);
    }
  }

  ref.once("value").then(function(snapShot) {
    var val = snapShot.val();
    var rtnVal = Object.keys(val).map(function(key) {
      return val[key];
    });
    res.send(rtnVal);
  })
});