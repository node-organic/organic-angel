var path = require("path")
var fs = require("fs");
var async = require("async")
var home = require("home-dir")

var Plasma = require("organic-plasma")
var Nucleus = require("organic-nucleus")

var Reactor = require("./lib/reactor")
var Loader = require("./lib/loader")
var loadDNA = require('./lib/dna')

module.exports = function Angel(){
  var self = this
  this.dnaSources = [
    path.join(process.cwd(), "dna", "angel.json"),
    path.join(process.cwd(), "dna", "angel"),
    path.join(process.cwd(), "angel.json"),
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
}

module.exports.prototype.autoloadDNA = function(done){
  var self = this
  async.detectSeries(this.dnaSources, fs.exists, function(found){
    if(found) {
      loadDNA(found, function(err, dna){
        if(err) return done(err)
        self.dna = dna
        done()
      })
    } else {
      done()
    }
  })
}

module.exports.prototype.start = function (done) {
  var self = this
  self.autoloadDNA(function (err) {
    if (err) return done(err)

    var nucleus = new Nucleus(self.plasma, self.dna)
    self.plasma.on("build", function(c, next){
      nucleus.build(c, next)
    })

    require('./lib/autoload-angel-modules').call(self, done)
  })
}

module.exports.prototype.clone = function(){
  var cloned = {}
  for (var key in this) {
    cloned[key] = this[key]
  }
  return cloned
}

module.exports.prototype.on = function(pattern, handler) {
  var self = this
  return this.reactor.on(pattern, function(cmdData, next){
    var state = self.clone()
    state.cmdData = cmdData
    handler(state, next)
  })
}

module.exports.prototype.once = function(pattern, handler) {
  var self = this
  return this.reactor.once(pattern, function(cmdData, next){
    var state = self.clone()
    state.cmdData = cmdData
    handler(state, next)
  })
}

module.exports.prototype.addDefaultHandler = function (handler) {
  return this.reactor.$defaultHandlers.push(handler)
}

module.exports.prototype.off = function (handlerMicroApi) {
  return this.reactor.off(handlerMicroApi)
}

module.exports.prototype.do = function(input, next) {
  this.reactor.do(input, next)
}
