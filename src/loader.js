var fs = require('fs')
var path = require("path")
var async = require('async')
var home = require("home-dir")

module.exports = function(contextFn){
  this.contextFn = contextFn
}

module.exports.prototype.loadScript = function(script, next) {
  var self = this
  var scriptLocations = [
    path.join(process.cwd(), script),
    path.join(process.cwd(), "node_modules", script),
    path.join(path.dirname(process.env["NVM_BIN"] || ""), "lib", "node_modules", script),
    path.join(home(), "angel_modules", script),
    path.join(home(), "angel_modules", "node_modules", script),
    script
  ]
  async.detect(scriptLocations, fs.exists, function(found){
    if(!found) { console.warn(script+" not found in "+scriptLocations); return next() }
    var m = require(found) 
    // if exported func is async reaction (context, next)
    if(m.length == 2) 
      return m(self.contextFn(), next)
    // otherwise invoke it directly and pass forward
    m(self.contextFn())
    next()
  })
}

module.exports.prototype.load = function(){
  var input = Array.prototype.slice.call(arguments, 0)
  var self = this
  
  // loadScripts(Array([]), next)
  if(Array.isArray(input[0])) {
    return async.each(input[0], function(f, n){
      self.loadScript(f, n)
    }, input[1])
  }

  // loadScripts(path1, path2, ... next)
  var next = input.pop()
  var rootDir = path.join.apply(path, input)
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