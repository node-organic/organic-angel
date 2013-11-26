var organic = require("organic");
var path = require("path");
var fs = require("fs");
var async = require("async")
var _ = require("underscore")
var npm = require("npm")

module.exports = function Angel(dna){

  var self = this
  this.$handlers = []
  this.plasma = new organic.Plasma();

  if(!dna) {
    this.loadSelfDNA(function(dna){
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

module.exports.prototype.loadSelfDNA = function(next){
  this.loadDnaByPath(path.join(process.cwd(),"dna"),function(dna){
    next(new organic.DNA(dna.angel))
  })
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
  organic.Cell.call(this, dna);
  var self = this
  this.dna = dna
  this.plasma.emit({"type": "build", branch: "membrane"})
  this.plasma.emit({"type": "build", branch: "plasma"})

  if(dna.scripts)
    this.loadScripts(dna.scripts, function(err){
      if(err) return console.error(err)
      self.plasma.emit({type: "ready"})
    })
  else
    // delay ready event to fall in async execution
    process.nextTick(function(){
      self.plasma.emit({type: "ready"})  
    })
}

module.exports.prototype.loadScripts = function(/* Array | path parts,... next */) {
  var self = this
  
  // loadScripts(Array([]), next)
  if(Array.isArray(arguments[0])) {
    return async.each(arguments[0], function(f, n){
      // npm install each script unless specified
      if(!self.dna.skipStartupInstall) {
        npm.load(require(process.cwd()+"/package.json"), function (er) {
          if (er) return n(er)
          npm.commands.install([f], function (er, data) {
            if (er) return n(er)
            // npm install done

            // require the module
            var m = require(f)
            if(m.length == 2)
              return m(self, n)
            m(self)
            n()    
          })
          if(self.dna.verbose)
            npm.on("log", function (message) { process.stdout.write(message) })
        })
      } else {
        // npm install for script is not executed
        var m = require(f)
        if(m.length == 2)
          return m(self, n)
        // however it is expected async execution, thus delay via nextTick
        process.nextTick(function(){
          m(self)
          n()  
        })
      }

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
      var m = require(f)
      if(m.length == 2)
        return m(self, n)
      m(self)
      n()
    }, next)
  })
}

module.exports.prototype.on = function(pattern, handler) {
  var placeholderPattern = /:([a-z0-9\(\)\|\.\*]+)/g
  var optionParts = []
  var original = pattern
  var m = pattern.match(placeholderPattern)
  if(m)
    for(var i = 0; i<m.length; i++)
      if(m[i].match(/\(*.\)/)) {
        var mm = m[i].match(/(.*)\(/)[1].substr(1)
        optionParts.push(mm)
        pattern = pattern.replace(/:([a-z0-9]+)\(/, "(")  
      } else {
        optionParts.push(m[i].substr(1))
        pattern = pattern.replace(m[i], "(.*)")  
      }
  pattern = new RegExp(pattern, "i")
  this.$handlers.push({
    pattern: pattern,
    optionParts: optionParts,
    handler: handler
  })
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
  process.stdout.write(JSON.stringify(result))
}

module.exports.prototype.do = function(input, next) {
  if(!next)
    next = this.defaultDoHandler
  var handlersChain = []
  for(var i = 0; i<this.$handlers.length; i++) {
    var matched = input.match(this.$handlers[i].pattern)
    if(matched && matched.length-1 == this.$handlers[i].optionParts.length) {
      var handler = this.$handlers[i].handler
      var optionParts = this.$handlers[i].optionParts
      if(this.$handlers[i].once)
        this.$handlers.splice(i, 1)
      var options = {}
      for(var k = 0; k<optionParts.length; k++)
        options[optionParts[k]] = matched[k+1]
      handlersChain.push({
        options: options,
        handler: handler
      })
    }
  }
  if(handlersChain.length == 0) return next(new Error("command not found"))
  if(handlersChain.length == 1) {
    var pair = handlersChain[0]
    return pair.handler(pair.options, next)
  }
  var lastResult = null
  async.eachSeries(handlersChain, function(pair, n){
    pair.handler(pair.options, function(err, result){
      if(err) return n(err)
      lastResult = result
      n()
    })
  }, function(err){
    if(err) return next(err)
    next(null, lastResult)
  })
}

module.exports.prototype.has = function(key) {
  return typeof this.dna[key] != "undefined"
}

module.exports.prototype.get = function(key) {
  return this.dna[key]
}

module.exports.prototype.cloneDNA = function(extra){
  return _.extend({}, this.dna, extra)
}