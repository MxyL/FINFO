var fs = require('fs');
var csv = require("csv-parse");

module.exports = {

  parseOperations: function(path) {
    fs.readFile('./operations.json', 'utf-8', function (err, data) {
      if (err) {
        return err; 
      }
      var data = JSON.parse(data);
      for (var i = 1; i < data.length; i++) {
        var dat = data[i];
        store("Operations", {
            operation_id: dat["operation_dim$operation_id"],
            vessel: dat["operation_dim$vessel"],
            performance_result: dat["operation_dim$performance_result"],
            operation_name: dat["operation_dim$project_name"]
          });
        }
    });
  },
  
  parseSelection: function(path) {
    fs.readFile('./selection.csv', 'utf-8', function (err, data) {
      if (err) {
        return err; 
      }
      csv(data, function(err, rows) {
        for (var i = 1; i < rows.length; i++) {
          var tokens = rows[i];
          store("Catch", {
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

function store(type, data) {
  var myDataRef = new Firebase('https://finfo1.firebaseio.com/');
  var child = myDataRef.child(type);
  child.push(data);
  // myDataRef.push(data)
  // console.log(data);
}