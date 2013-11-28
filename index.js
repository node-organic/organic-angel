var organic = require("organic");
var path = require("path");
var fs = require("fs");
var async = require("async")
var _ = require("underscore")
var npm = require("npm")
var Reactor = require("./reactor")

module.exports = function Angel(dna){

  var self = this
  
  this.plasma = new organic.Plasma();
  this.reactor = new Reactor()

  if(!dna) {
    this.loadDnaByPath(path.join(process.cwd(),"dna"),function(dna){
      self.start(dna.angel)
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
  if(path.extname(p) == ".json") {
    dna.loadFile(p, function(){
      next(dna)
    })
  } else {
    fs.exists(p, function(found){
      if(!found) return next(dna)
      dna.loadDir(p, function(){
        next(dna)
      })    
    })
  }
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
  if(dna.scripts) {
    var next = function(err){
      if(err) return console.error(err)
      self.plasma.emit({type: "ready"})
    }
    if(dna.installScripts)
      this.installAndLoadScripts(dna.scripts, next)
    else
      this.loadScripts(dna.scripts, next)
  } else {
    // delay ready event to fall in async execution
    process.nextTick(function(){
      self.plasma.emit({type: "ready"})  
    })
  }
}

module.exports.prototype.loadScript = function(script, next) {
  // require the module
  var self = this
  if(script.indexOf(".") === 0)
    script = path.join(process.cwd(), script)
  if(script.indexOf("/") !== 0 && script.indexOf(":") !== 1)
    script = path.join(process.cwd(), "node_modules", script)
  var m = require(script)
  if(m.length == 2)
    return m(this, next)
  process.nextTick(function(){
    m(self)
    next()  
  })
}

module.exports.prototype.installAndLoadScripts = function(scripts, next) {
  var self = this

  async.each(scripts, function(f, n){
    npm.load(require(process.cwd()+"/package.json"), function (er) {
      if (er) return n(er)
      npm.commands.install([f], function (er, data) {
        if (er) return n(er)
        // npm install done
        self.loadScript(f, n)
      })
      if(self.dna.verbose)
        npm.on("log", function (message) { process.stdout.write(message) })
    })
  }, next)
}

module.exports.prototype.loadScripts = function(/* Array | path parts,... next */) {
  var self = this
  
  // loadScripts(Array([]), next)
  if(Array.isArray(arguments[0])) {
    return async.each(arguments[0], function(f, n){
      self.loadScript(f, n)
    }, arguments[1])
  }

  // loadScripts(path1, path2, ... next)
  var args = Array.prototype.slice.call(arguments, 0)
  var next = args.pop()
  var rootDir = path.join.apply(path, args)
  var self = this
  fs.readdir(rootDir, function(err, files){
    files = files.map(function(f){
      return path.join(rootDir, f)
    })
    async.each(files, function(f, n){
      if(path.extname(f) != ".js") return n()
      self.loadScript(f, n)
    }, next)
  })
}

module.exports.prototype.on = function(pattern, handler) {
  this.reactor.on(pattern, handler)
}

module.exports.prototype.do = function(input, options, next) {
  if(typeof options == "function") {
    next = options
    options = undefined
  }
  if(!next)
    next = this.defaultDoHandler
  this.reactor.do(input, options, next)
}

module.exports.prototype.react = function(input, dataName) {
  var self = this
  return function(c, next) {
    self.do(input, dataName?c[dataName]:c, next)
  }
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

module.exports.prototype.has = function(key) {
  return typeof this.dna[key] != "undefined"
}

module.exports.prototype.get = function(key) {
  return this.dna[key]
}

module.exports.prototype.defaults = function(extra){
  return _.extend({}, this.dna.defaults, extra)
}