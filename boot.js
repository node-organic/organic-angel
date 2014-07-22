var path = require("path")
var fs = require("fs")

var DNA = require("organic-dna")
var Nucleus = require("organic-nucleus")
var resolveReferences = require("organic-dna-resolvereferences")
var fold = require("organic-dna-fold")

var async = require("async")

var findAngelScriptModules = function(done) {
  var rootDir = path.join(process.cwd(), "node_modules")
  var scriptPaths = []
  fs.readdir(rootDir, function(err, entries){
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
            if(json.peerDependencies && json.peerDependencies["organic-angel"]) {
              var script = path.join(f, "index.js")
              if(json.main)
                script = path.join(f, json.main)
              if(path.extname(script) == "")
                script += ".js"
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

var loadScripts = function(next){
  if(this.angelDNA.scripts) {
    this.scripts.load(this.angelDNA.scripts, next)
  } else {
    var self = this
    findAngelScriptModules(function(err, scriptPaths){
      if(err) return next(err)
      self.angelDNA.scripts = scriptPaths
      self.scripts.load(self.angelDNA.scripts, next)
    })
  }
}

module.exports = function(dna){
  var self = this
  var dna = dna instanceof DNA?dna:new DNA(dna)
  resolveReferences(dna)
  if(process.env.CELL_MODE)
    fold(dna, process.env.CELL_MODE)

  var nucleus = new Nucleus(self.plasma, dna)
  self.plasma.on("build", function(c, next){
    nucleus.build(c, next)
  })
  
  this.angelDNA = dna
  if(this.angelDNA.membrane)
    this.plasma.emit({"type": "build", branch: "membrane"})
  if(this.angelDNA.plasma)
    this.plasma.emit({"type": "build", branch: "plasma"})

  this.dna = new DNA()
  this.dna.loadDir(path.join(process.cwd(), "dna"), function(err){
    self.abilities.load(self.angelDNA.abilities || [], function(err){
      if(err) return console.error(err)
      loadScripts.call(self, function(err){
        if(err) return console.error(err)
        process.nextTick(function(){
          self.plasma.emit({type: "ready"})    
        })  
      })
    })
  })
}