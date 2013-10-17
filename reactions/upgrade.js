var organic = require("organic");

module.exports = organic.Organel.extend(function Upgrade(plasma, config){
  organic.Organel.call(this, plasma, config);

  var self = this;
  this.on("upgrade", function(c, next){
    var commands = c.commands || config.commands || [
      "git pull",
      "npm install --production"
    ]
    var cmd = commands.join(";")
    var child = shelljs.exec(cmd,{async: true, silent: true});
    child.stdout.on("data", function(d){
      next && next(d);
    })
    child.stderr.on("data", function(d){
      next && next(d);
    })
    child.on("exit", function(code, signal){
      if(code == 0)
        self.emit({type: "Tissue", action: "restart", target: c.cell.target}, next)
      else
        next && next({code: code, signal: signal});
    })
  });
});
