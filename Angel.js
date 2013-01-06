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
  populate: function(target, template, data, callback){
    if(typeof data == "function") {
      callback = data;
      data = {
        name: path.basename(target,path.extname(target))
      }
    }
    this.plasma.emit({type: "populate", target: target, template: template, data: data}, callback);
  }
})