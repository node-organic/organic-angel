var organic = require("organic");
var path = require("path");
var fs = require("fs");

module.exports = organic.Cell.extend(function Angel(dna){
  
  var angelDNAPath = process.cwd()+"/dna/angel.json";
  this.plasma = new organic.Plasma();

  if(!dna) {
    var self = this;
    dna = new organic.DNA();
    dna.mapDirectoryToBranch("plasma", path.join(__dirname, "actions"), function(){
      dna.createBranch("membrane.Tissue", {
        source: path.join(__dirname,"/node_modules/organic-cells/membrane/Tissue"),
        bindTo: "angels"
      });
      fs.exists(angelDNAPath, function(exists){
        if(!exists) {
          organic.Cell.call(self, dna);
          self.plasma.emit("surviveExceptions");
          self.plasma.emit("Angel");
        } else {
          dna.loadFile(angelDNAPath, "angel", function(){
            dna.mergeBranchInRoot("angel");
            organic.Cell.call(self, dna);
            self.plasma.emit("surviveExceptions");
            self.plasma.emit("Angel");
          })
        }
      })
      
    });
  } else {
    organic.Cell.call(this, dna);
    self.plasma.emit("Angel");
  }
})