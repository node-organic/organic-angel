var organic = require("organic");
var DNA = organic.DNA;
var glob = require("glob");
var shelljs = require("shelljs");
var path = require("path");
var fs = require('fs');
var async = require('async');

module.exports = organic.Organel.extend(function On(plasma, config){
  organic.Organel.call(this, plasma, config);

  var self = this;
  this.on("on", function(c, next){
    var parts = c.value.split(" ")
    var name = parts.shift()
    if(c.cell[name]) {
      c.cell = c.cell[name]
      c.cell.name = name
      c.value = parts.join(" ")
      var commands = c.cell.defaultCommands || [
        c.cell.nvmSource || ". ~/.nvm/nvm.sh",
        c.cell.nodeVersion || "nvm use "+process.version
      ]
      if(c.cell.cwd)
        commands.push("cd "+c.remote.cwd)
      if(c.value)
        commands.push("angel cell "+c.cell.name+c.value)
      var cmd = "ssh "+c.cell.remote+' "'+commands.join(";")+'"';
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
    } else
      next && next()
  });
});
