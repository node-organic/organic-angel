var organic = require("organic");
var glob = require("glob");
var shelljs = require("shelljs");
var path = require("path");
var TempDir = require('temporary/lib/dir');

module.exports = organic.Organel.extend(function PopulateLocal(plasma, config){
  organic.Organel.call(this, plasma, config);
  this.on("PopulateLocal", this.populate)
}, {
  populate: function(c, sender, callback){
    if(c.template.indexOf("://") != -1) {
      var tempDir = new TempDir;
      var cmd = "git clone "+c.template+" "+tempDir.path;
      var result = shelljs.exec(cmd);
      if(result.code != 0)
        return callback(new Error("failed to exec cmd "+cmd));
      c.origin = c.template;
      c.template = tempDir.path;
      this.populate(c, sender, function(r){
        shelljs.rm('-rf', tempDir.path);
        callback(r);
      });
    } else {
      if(!c.data)
        c.data = { name: path.basename(c.target) }
      if(c.target.lastIndexOf("/") !== c.target.length-1)
        c.target += "/";
      if(c.target.indexOf(".") === 0)
        c.target = path.resolve(process.cwd(), c.target);
      if(c.template.indexOf(".") === 0)
        c.template = path.resolve(process.cwd(), c.template);

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