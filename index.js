var organic = require("organic");
var path = require("path");
var fs = require("fs");
var async = require("async")
var _ = require("underscore")
var format = require("string-template")
var Reactor = require("./src/reactor")
var Loader = require("./src/loader")

module.exports = function Angel(dna){
  var self = this
  
  this.plasma = new organic.Plasma();
  this.reactor = new Reactor()
  this.abilities = new Loader(function(){
    return self
  })
  this.scripts = new Loader(function(){
    return self.clone()
  })

  if(!dna) {
    fs.exists(path.join(process.cwd(), "angel.json"), function(exists){
      if(exists)
        self.loadDnaByPath(path.join(process.cwd(), "angel.json"), function(dna){
          self.start(dna)
        })
      else
        self.loadDnaByPath(path.join(process.cwd(), "dna"), function(dna){
          self.start(dna)
        })
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

module.exports.prototype.loadDnaByPath = function(p, next) {
  var dna = new organic.DNA()
  fs.exists(p, function(found){
    if(!found) return next(dna)

    if(path.extname(p) == ".json") {
      dna.loadFile(p, function(){
        next(dna)
      })
    } else {
      dna.loadDir(p, function(){
        if(dna.angel)
          next(dna.angel)
        else
          next(dna)
      })
    }
  })
}

module.exports.prototype.start = function(dna){
  dna = dna instanceof organic.DNA?dna:new organic.DNA(dna)
  if(dna.index)
    dna.mergeBranchInRoot("index")
  organic.Cell.call(this, dna);
  
  this.dna = dna
  this.plasma.emit({"type": "build", branch: "membrane"})
  this.plasma.emit({"type": "build", branch: "plasma"})

  var self = this
  self.abilities.load(dna.abilities || [], function(err){
    if(err) return console.error(err)
    self.scripts.load(dna.scripts || [], function(err){
      if(err) return console.error(err)
      process.nextTick(function(){
        self.plasma.emit({type: "ready"})    
      })  
    })
  })
}

module.exports.prototype.loadScripts = function(){
  var self = this
  self.scripts = new Loader(function(){
    return self.clone()
  })
  self.scripts.load.apply(self.scripts, arguments)
}

module.exports.prototype.clone = function(){
  return _.extend({}, this)
}

module.exports.prototype.on = function(pattern, handler) {
  var self = this
  this.reactor.on(pattern, function(cmdData, next){
    handler(_.extend(self.clone(), {cmdData: cmdData}), next)
  })
}

module.exports.prototype.do = function(input, next) {
  if(next)
    return this.reactor.do(format(input, this.cmdData), next)
  return function(angel, next){
    angel.reactor.do(format(input, angel.cmdData), next)
  }
}

module.exports.prototype.react = function(input) {
  this.do(input, this.defaultDoHandler)
}

module.exports.prototype.defaultDoHandler = function(err, result){
  if(err) {
    console.error(err)
    return process.exit(1)
  }
  if(result && result.stdout && result.stderr && result.on) {
    result.stdout.pipe(process.stdout)
    result.stderr.pipe(process.stderr)
    result.on("close", function(code){
      process.exit(code)
    })
  }
  if(typeof result == "string")
    process.stdout.write(result+"\n")
  else
    process.stdout.write(JSON.stringify(result, function(key, value){
      if(value && typeof value == "object" && value.pid)
        return {pid: value.pid};
      return value;
    }, 2)+"\n")
}