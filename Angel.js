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

  var self = this
  this.plasma = new organic.Plasma();

  if(!dna) {
    this.loadSelfDNA(new organic.DNA(), function(dna){
      self.start(dna)
    })
  } else
  if(typeof dna == "string") {
    this.loadDnaByPath(dna, function(dna){
      self.start(dna)
    })
  }
  else
    this.start(dna)
}

module.exports.prototype.loadSelfDNA = function(dna, next){
  var self = this
  dna.loadDir(path.join(__dirname,"dna"), function(){
    expandPaths(dna)
    var angelDNAPath = path.join(process.cwd(),"dna","angel");
    fs.exists(angelDNAPath, function(found){
      if(!found) {
        next(dna)
      } else {
        dna.loadDir(angelDNAPath,"angel", function(){
          dna.mergeBranchInRoot("angel");
          next(dna)
        })
      }
    })
  })
}


module.exports.prototype.loadDnaByPath = function(path, next) {
  if(path.extname(path) == ".json") {
    var dna = new organic.DNA()
    dna.loadFile(path, function(){
      next(dna)
    })
  } else {
    var dna = new organic.DNA()
    dna.loadDir(path, function(){
      next(dna)
    })
  }
}

module.exports.prototype.start = function(dna){
  organic.Cell.call(this, dna);
  this.plasma.emit({"type": "build", branch: "membrane"})
  this.plasma.emit({"type": "build", branch: "plasma"})
  this.plasma.emit({type: "ready"})
}
