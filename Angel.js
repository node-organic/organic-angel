var organic = require("organic");
var path = require("path");
var fs = require("fs");

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
  var dna = new organic.DNA()
  dna.loadDir(path.join(process.cwd(),"dna","angel"),function(){
    next(dna)
  })
}

module.exports.prototype.loadDnaByPath = function(path, next) {
  var dna = new organic.DNA()
  if(path.extname(path) == ".json") {
    dna.loadFile(path, function(){
      next(dna)
    })
  } else {
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
