var path = require("path")
var fs = require("fs")
var async = require("async")

var filterScripts = function(json) {
  return json.name && json.name.indexOf("angelscript") != 0
}

var filterAbilities = function(json) {
  return json.name && json.name.indexOf("angelabilit") != 0
}

var findAngelScriptModules = function(filter, done) {
  var rootDir = path.join(process.cwd(), "node_modules")
  var scriptPaths = []
  fs.readdir(rootDir, function(err, entries){
    if(err) return done(null, [])
    entries = entries.map(function(f){
      return path.join(rootDir, f)
    })
    async.eachSeries(entries, function(f, n){
      var packagejson = path.join(f, "package.json")
      fs.exists(packagejson, function(found){
        if(!found) return n()
        fs.readFile(packagejson, function(err, data){
          try {
            var json = JSON.parse(data.toString())
            var isFiltered = filter(json)
            if(!isFiltered && json.peerDependencies && json.peerDependencies["organic-angel"]) {
              var script = f
              if(json.main)
                script = path.join(f, json.main)
              scriptPaths.push(script)
            }
          } catch(err){
            console.warn("found err", err, "at", packagejson, ":ignored")
          }
          n()
        })
      })
    }, function(err){
      if(err) return done(err)
      done(null, scriptPaths)
    })
  })
}

var loadModules = function(loader, moduleFilter, next){
  var self = this
  findAngelScriptModules(moduleFilter, function(err, paths){
    if(err) return next(err)
    loader.loadScripts(paths, next)
  })
}

module.exports = function(done){
  var self = this
  loadModules.call(self, self.abilities, filterAbilities, function(err){
    if(err) return done(err)
    loadModules.call(self, self.scripts, filterScripts, function(err){
      if(err) return done(err)
      self.plasma.emit({type: "autoloadReady"})
      done()
    })
  })
}
