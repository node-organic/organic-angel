var organic = require("organic");

module.exports = organic.Organel.extend(function Install(plasma, config){
  organic.Organel.call(this, plasma, config);

  var self = this;
  this.on("install", function(c, next){
    var commands = c.commands || config.commands || [
      "mkdir -p "+c.cell.cwd,
      "git clone "+c.cell.repository.url+" "+c.cwd,
      "cd "+c.cwd,
      c.cell.nvmSource || ". ~/.nvm/nvm.sh",
      c.cell.nodeVersion || "nvm use "+process.version,
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
      next && next({code: code, signal: signal});
    })
  });
});
