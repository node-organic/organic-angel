var organic = require("organic");

module.exports = organic.Organel.extend(function(plasma, config){
  organic.Organel.call(this, plasma, config);
  this.on("TestCell", function(c, sender, callback){
    this[c.action](c, sender, callback);
  });
}, {
  "doSomething": function(){
    console.log("Hello");
  }
})