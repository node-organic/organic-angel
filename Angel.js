var organic = require("organic");
var path = require("path");

module.exports = organic.Cell.extend(function Angel(dna){
  this.plasma = new organic.Plasma();

  if(!dna) {
    var self = this;
    dna = new organic.DNA();
    dna.mapDirectoryToBranch("plasma", __dirname+"/actions", function(){
      dna.createBranch("membrane.Tissue", {
        source: __dirname+"/node_modules/organic-cells/membrane/Tissue",
        bindTo: "angels"
      });
      organic.Cell.call(self, dna);
      self.plasma.emit("Angel");
    });
  } else {
    organic.Cell.call(this, dna);
    self.plasma.emit("Angel");
  }
})