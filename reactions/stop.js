var organic = require("organic");

module.exports = organic.Organel.extend(function Stop(plasma, config){
  organic.Organel.call(this, plasma, config);

  var self = this;
  this.on("stop", function(c, next){
    self.emit({type: "Tissue", action: "stop", target: c.value}, next);
  });
});
