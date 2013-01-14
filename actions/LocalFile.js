var organic = require("organic");
var fs = require('fs');
var path = require('path');

var printContentsUntilEnd = function(fd, result, callback) {
  var buffer = new Buffer(1024);
  fs.read(fd, buffer, 0, 1024, null, function(err, bytesRead, buffer){
    if(bytesRead != 0) {
      result += buffer.toString('utf-8', 0, bytesRead);
      printContentsUntilEnd(fd, result, callback);
    } else {
      result += "--- " + new Date() + "---";
      callback(result);
    }
  })
}

module.exports = organic.Organel.extend(function LocalFile(plasma, config){
  organic.Organel.call(this, plasma, config);
  this.on("LocalFile", function(c, sender, callback){
    this[c.action](c, sender, callback);
  });
}, {
  watch: function(c, sender, callback) {
    var fd = fs.openSync(c.target, 'r');
    printContentsUntilEnd(fd, "", function(fileContents){
      callback({data: fileContents});
    });
    fs.watch(c.target, function(event, filename){
      printContentsUntilEnd(fd, "", function(fileContents){
        callback({data: fileContents});
      });
    });
  }
});