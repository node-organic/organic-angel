var fs = require('fs')
var path = require("path")
var async = require('async')

module.exports = function(contextFn){
  this.contextFn = contextFn
}

module.exports.prototype.loadScript = function(script, next) {
  var self = this
  if(script.indexOf(".") === 0)
    script = path.join(process.cwd(), script)
  if(script.indexOf("/") !== 0 && script.indexOf(":") !== 1)
    script = path.join(process.cwd(), "node_modules", script)
  var m = require(script)
  if(m.length == 2)
    return m(this.contextFn(), next)
  process.nextTick(function(){
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