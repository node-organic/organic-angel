var DNA = require("organic").DNA
var DNAloader = require("organic-dna-fsloader")
var Plasma = require("organic-plasma")

var path = require("path")
var fs = require("fs");
var async = require("async")
var _ = require("underscore")
var home = require("home-dir")
var format = require("string-template")
var Reactor = require("./lib/reactor")
var Loader = require("./lib/loader")

module.exports = function Angel(dna){
  var self = this
  var sources = [ 
    path.join(process.cwd(), "dna", "angel.json"),
    path.join(process.cwd(), "angel.json"),
    path.join(process.cwd(), "dna"),
    path.join(home(), "angel.json"),
    path.join(home(), "angel", "dna")
  ]

  this.plasma = new Plasma();
  this.reactor = new Reactor()
  this.abilities = new Loader(function(){
    return self
  })
  this.scripts = new Loader(function(){
    return self.clone()
  })

  if(dna === false)
    return self.start()

  if(!dna) {
    async.detectSeries(sources, fs.exists, function(found){
      if(found)
        self.loadDnaByPath(found, function(err, dna){
          if(err) return console.error(err)
          self.start(dna)
        })
      else
        self.start()
    })
  } else
  if(typeof dna == "string") {
    this.loadDnaByPath(dna, function(err, dna){
      if(err) return console.error(err)
      self.start(dna)
    })
  }
  else
    this.start(dna)
}

module.exports.prototype.loadDnaByPath = function(p, next) {
  var dna = new DNA()
  fs.exists(p, function(found){
    if(!found) return next(dna)

    if(path.extname(p) == ".json") {
      DNAloader.loadFile(dna, p, function(err){
        next(err, dna)
      })
    } else {
      DNAloader.loadDir(dna, p, function(err){
        next(err, dna)
      })
    }
  })
}

module.exports.prototype.start = function(dna){
  require("./boot").call(this, dna)
}

module.exports.prototype.loadScript = function(script, done) {
  this.scripts.loadScript(script, done)
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
  return this.reactor.on(pattern, function(cmdData, next){
    handler(_.extend(self.clone(), {cmdData: cmdData}), next)
  })
}

module.exports.prototype.once = function(pattern, handler) {
  var self = this
  return this.reactor.once(pattern, function(cmdData, next){
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

module.exports.prototype.render = function(err, data) {
  if(err) { 
    console.error(err); 
    return process.exit(1) 
  }
  if(data) {
    process.stdout.write(data)
    process.stdout.write("\n")
  }
}