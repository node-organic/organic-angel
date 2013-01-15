var organic = require("organic");
var glob = require("glob");
var shelljs = require("shelljs");
var path = require("path");

module.exports = organic.Organel.extend(function Cell(plasma, config){
  organic.Organel.call(this, plasma, config);
  this.on("Cell", function(c, sender, callback){
    this[c.action](c, sender, callback);
  });
}, {
  "install": function(c, sender, callback){
    if(c.remote) {
      var cmd = ". ~/.nvm/nvm.sh; nvm use "+process.version+"; "+
        "mkdir -p "+c.target+"; "+
        "git clone "+c.source+" "+c.target+"; "+
        "cd "+c.target+"; "+
        "npm install; "
      var child = shelljs.exec("ssh "+c.remote+' "'+cmd+'"', {async: true});
      child.on('exit', function(code){
        console.log('done with code ', code);
      });
    } else {
      shelljs.mkdir('-p', c.target);
      shelljs.exec("git clone "+c.source+" "+c.target);
      shelljs.cd(c.target);
      shelljs.exec("npm install");
    }
  },
  "upgrade": function(c, sender, callback){
    process.kill(c.target, "SIGUSR1");
    if(callback) callback();
  },
  "restart": function(c, sender, callback){
    process.kill(c.target, "SIGUSR2");
    if(callback) callback();
  }
});