var organic = require("organic");
var path = require("path");

module.exports = organic.Cell.extend(function Angel(dna){
  this.plasma = new organic.Plasma();

  if(!dna) {
    var self = this;
    dna = new organic.DNA();
    dna.mapDirectoryToBranch("plasma", __dirname+"/plasma", function(){
      organic.Cell.call(self, dna);  
      self.plasma.emit("ready");
    });
  } else {
    organic.Cell.call(this, dna);
    self.plasma.emit("ready");
  }
}, {
  populateLocal: function(target, template, data, callback){
    if(typeof data == "function") {
      callback = data;
      data = undefined;
    }
    this.plasma.emit({
      type: "PopulateLocal", 
      target: target, 
      template: template, 
      data: data}, callback);
  },
  populateRemote: function(remote, target, template, data, callback) {
    if(typeof data == "function") {
      callback = data;
      data = undefined;
    }
    this.plasma.emit({
      type: "PopulateRemote", 
      remote: remote, 
      target: target, 
      template: template, 
      data: data}, callback);
  }
})