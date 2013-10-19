var organic = require("organic");
var path = require("path");
var fs = require("fs");

var expandPaths = function(dna) {
  for(var key in dna.membrane)
    dna.membrane[key].source = path.join(__dirname, dna.membrane[key].source)
  for(var key in dna.plasma)
    dna.plasma[key].source = path.join(__dirname, dna.plasma[key].source)
}

module.exports = function Angel(dna){

  var angelDNAPath = path.join(process.cwd(),"dna","angel");
  this.plasma = new organic.Plasma();

  if(!dna) {
    var self = this;
    dna = new organic.DNA();
    dna.loadDir(path.join(__dirname,"dna"), function(){
      expandPaths(dna)

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
    })
  } else
    this.start(dna)
}

module.exports.prototype.start = function(dna){
  organic.Cell.call(this, dna);
  this.plasma.emit({"type": "build", branch: "membrane"})
  this.plasma.emit({"type": "build", branch: "plasma"})
  this.plasma.emit({type: "Angel"});
}
