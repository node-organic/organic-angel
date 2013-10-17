var organic = require("organic");

module.exports = organic.Organel.extend(function Restart(plasma, config){
  organic.Organel.call(this, plasma, config);

  var self = this;
  this.on("restart", function(c, next){
    next.emit({type: "Tissue", action: "restart", target: c.cell.target});
  });
});
