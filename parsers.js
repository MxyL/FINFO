var fs = require('fs');
var csv = require("csv-parse");

module.exports = {

  parseDenmark: function(path) {
    
  },
  
  parseSelection: function(path) {
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
};

function store(data) {
  // var myDataRef = new Firebase('https://intense-fire-4574.firebaseio.com/');
  // myDataRef.push(data)
  console.log(data);
}