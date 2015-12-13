var fs = require('fs')
var path = require("path")
var async = require('async')
var home = require("home-dir")

module.exports = function(contextFn){
  this.contextFn = contextFn
  this.loadedModules = []
}

module.exports.prototype.loadScript = function(script, next) {
  var self = this
  var scriptLocations = [
    script,
    path.join(process.cwd(), script),
    path.join(process.cwd(), "node_modules", script),
    path.join(home(), "angel", script),
    path.join(home(), "angel", "scripts", script)
  ]
  async.detectSeries(scriptLocations, fs.exists, function(found){
    if(!found) { return next(new Error(script+" not found in "+scriptLocations)) }
    try {
      var m = require(found) // TODO do not require at all non-angel modules
      if (typeof m === 'function') {
        self.loadedModules.push(m)
        // if exported func is async reaction (context, next)
        if(m.length === 2)
          return m(self.contextFn(), next)
        // otherwise invoke it directly and pass forward
        m(self.contextFn())
      }
    } catch(err){
      return next(err)
    }
    next()
  })
}

module.exports.prototype.loadScripts = function(scriptPaths, next){
  var self = this
  async.eachSeries(scriptPaths, function(p, n){
    self.loadScript(p, n)
  }, next)
}

module.exports.prototype.loadScriptsByPath = function(scriptsPath, next){
  var self = this
  fs.readdir(scriptsPath, function(err, files){
    if (err) return next(err)
    files = files.map(function(f){
      return path.join(scriptsPath, f)
    })
    async.eachSeries(files, function(f, n){
      if (f.indexOf('.js') > -1) {
        self.loadScript(f, n)
      } else {
        n()
      }
    }, next)
  })
}
