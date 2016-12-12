/* jshint undef: false, esversion: 6 */
 
(function () {
  "use strict";  
  
  const walk = require('walk');
  const fs = require('fs');
  var semiColognes = 0;
  const dir = process.argv[2];
  // TODO: figure a way to filter out front end lib code fro sloc count
  const options = {filters: ['node_modules', 'thirdParty', '.git', 'bower_components', 'apidoc']};
  const walker = walk.walk(dir, options);
  const path = require('path');
  
    
  walker.on("file", function(root, fileStat, next) {           
    var fileName = fileStat.name;
    var filePath = path.join(root, fileName);      
    if ( fileName.endsWith(".js") ) {
      fs.readFile(filePath, function (err, data) {
        if (err) {
          console.error(err);
          next();
          return;
        }
 
        var sems = (String(data).match(/;/g) || []).length;
        if ( sems ) {
          console.log(fileName + ": " + sems);
          semiColognes += sems;          
        }
        next();
      });  
    } else {        
      next();
    }
  });
  
  
  
  walker.on("errors", function (root, nodeStatsArray, next) {
    next();
  });
  
  walker.on("end", function() {
    console.log('total lines: ' + semiColognes.toString());
  });
  
}());