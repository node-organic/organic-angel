var organic = require("organic");
var DNA = organic.DNA;
var glob = require("glob");
var shelljs = require("shelljs");
var path = require("path");

module.exports = organic.Organel.extend(function Service(plasma, config){
  organic.Organel.call(this, plasma, config);
  
  this.on("Service", function(c, sender, callback){
    this[c.action](c, sender, callback);
  });
}, {
  "register": function(c, sender, callback) {
    
    require("servicer").init(function(services){
      services.install(c.target, process.cwd(), c.target, function(err){
        if(err) return callback(err);
        callback({data: "done"});
      });
    })
  },
  "unregister": function(c, sender, callback){
    require("servicer").init(function(services){
      services.install(c.target, process.cwd(), c.target, function(err){
        if(err) return callback(err);
        callback({data: "done"});
      });
    })
  }
});