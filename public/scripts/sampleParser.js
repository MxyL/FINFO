var fs = require('fs');

function store(data) {
  var myDataRef = new Firebase('https://finfo.firebaseio.com/');
  myDataRef.set(data);
}

function parse(data) {
  
  store({"test": "test"});
  fs.readFile('./selection.c', function (err, data) {
  if (err) {
    throw err; 
  }
  console.log(data);
});
}