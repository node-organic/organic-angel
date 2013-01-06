var organic = require("organic");
var glob = require("glob");
var shelljs = require("shelljs");
var path = require("path");
var TempDir = require('temporary/lib/dir');

module.exports = organic.Organel.extend(function PopulateRemote(plasma, config){
  organic.Organel.call(this, plasma, config);
  this.on("PopulateRemote", this.populate)
}, {
  populate: function(c, sender, callback){
    var remoteTarget = c.target;
    if(!c.data)
      c.data = { name: path.basename(c.target) }
    c.target = (new TempDir()).path;
    c.type = "PopulateLocal";
    this.emit(c, function(r){
      if(r instanceof Error) return callback(r);
      var result = shelljs.exec("ssh "+c.remote+' "mkdir -p '+remoteTarget+'"');
      if(result.code != 0)
        return callback(new Error("failed to mkdir -p on remote "+c.remote));
      if(c.target.lastIndexOf("/") !== c.target.length-1)
        c.target += "/";
      var result = shelljs.exec("scp -r "+c.target+"* "+c.remote+":"+remoteTarget);
      if(result.code != 0)
        return callback(new Error("failed to scp -r on remote "+c.remote));
      shelljs.rm('-rf', c.target);
      callback(r);
    });
  }
})