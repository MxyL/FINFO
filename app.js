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

var firebase = new Firebase('https://finfo1.firebaseio.com/');

app.get("/catch", function(req, res) {
  var ref = firebase.child("catch");
  if(req.query.filter) {
    if(req.query.filter.indexOf(">=") >= 0) {
      ref = ref.orderByChild(req.query.filter.split(">=")[0]).startAt(req.query.filter.split(">=")[1]);
    }
    else if(req.query.filter.indexOf("<=") >= 0) {
      ref = ref.orderByChild(req.query.filter.split("<=")[0]).endAt(req.query.filter.split("<=")[1]);
    }
    else if(req.query.filter.indexOf("=") >= 0) {
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
})


app.get('/test', function (req, res) {
  // res.send('GET request to the homepage');
  data = parse();
  res.send(data);
});

function store(data) {
  firebase.child("catch").push(data);
}

function parse(data) {
  fs.readFile('./selection.csv', 'utf-8', function (err, data) {
    if (err) {
      return err;
    }
    csv(data, function(err, rows) {
      for (var i = 1; i < rows.length; i++) {
        var tokens = rows[i];
        store({
            species: tokens[0],
            date: tokens[1],
            latitude: tokens[2],
            longitude: tokens[3],
            operation_id: tokens[4],
            vessel: tokens[5],
            total_catch_number: tokens[6],
            total_catch_weight_kg: tokens[7]
          });
        }
    })
  });
}
