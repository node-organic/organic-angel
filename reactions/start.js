var organic = require("organic");

module.exports = organic.Organel.extend(function Start(plasma, config){
  organic.Organel.call(this, plasma, config);

  var self = this;
  this.on("start", function(c, next){
    self.emit({type: "Tissue", action: "start", target: c.cell.target}, next);
  });
});
