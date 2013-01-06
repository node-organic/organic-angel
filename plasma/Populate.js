var organic = require("organic");
var glob = require("glob");
var shelljs = require("shelljs");
var path = require("path");

module.exports = organic.Organel.extend(function Populate(plasma, config){
  organic.Organel.call(this, plasma, config);
  this.on("populate", this.populate)
}, {
  populate: function(c, sender, callback){
    if(c.template.indexOf("://") != -1) {
      throw new Error("can't do that yet");
    } else {
      glob(c.template+"/**/*.*", function(err, files) {
        if(err) return callback(err);
        files.forEach(function(file){
          var targetFileName = file.replace(c.template, "");
          for(var key in c.data)
            targetFileName = targetFileName.replace("%"+key+"%", c.data[key]);
          var targetFile = c.target+targetFileName;
          shelljs.mkdir('-p', path.dirname(targetFile));
          shelljs.cp(file, targetFile);
          for(var key in c.data)
            shelljs.sed('-i', "%"+key+"%", c.data[key], targetFile);
        });
        callback(c);
      });
    }
  }
})