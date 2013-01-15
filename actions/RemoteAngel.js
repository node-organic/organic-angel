var organic = require("organic");
var shelljs = require("shelljs");
var path = require("path");

module.exports = organic.Organel.extend(function Directory(plasma, config){
  organic.Organel.call(this, plasma, config);
  this.on("RemoteAngel", function(c, sender, callback){
    this[c.action](c, sender, callback);
  });
}, {
  "invoke": function(c, sender, callback) {
    // assuming that this is remote in format user@server
    // TODO get nvm resolver?
    var cmd = "ssh "+c.remote+' ". ~/.nvm/nvm.sh; nvm use '+process.version+"; "+
      'angel '+c.argv.join(" ")+'"';
    var child = shelljs.exec(cmd, {async:true});
    child.on('exit', function(code){
      if(callback) callback({data: code});
    });
  }
});