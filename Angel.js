var organic = require("organic");
var path = require("path");
var fs = require("fs");

module.exports = function Angel(dna){

  var angelDNAPath = path.join(process.cwd(),"dna","angel");
  this.plasma = new organic.Plasma();

  if(!dna) {
    var self = this;
    dna = new organic.DNA();
    dna.loadDir(path.join(__dirname,"dna"), function(){
      dna.membrane.Tissue.source = path.join(__dirname,"node_modules","organic-tissue")
      dna.plasma.CommandReactor = {
        source: path.join(__dirname,"node_modules","organic-commandreactor"),
        reactions: path.join(__dirname, "reactions")
      }
    })
    fs.exists(angelDNAPath, function(found){
      if(!found) {
        self.start(dna)
      } else {
        dna.loadDir(angelDNAPath,"angel", function(){
          dna.mergeBranchInRoot("angel");
          self.start(dna)
        })
      }
    })
  } else
    this.start(dna)
}

module.exports.prototype.start = function(dna){
  organic.Cell.call(this, dna);
  this.plasma.emit({"type": "build", branch: "membrane"})
  this.plasma.emit({"type": "build", branch: "plasma"})
  this.plasma.emit("Angel");
}
