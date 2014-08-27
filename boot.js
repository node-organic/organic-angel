var path = require("path")
var fs = require("fs")

var DNA = require("organic").DNA
var loadDir = require("organic-dna-fsloader").loadDir
var selectBranch = require("organic-dna-branches").selectBranch
var Nucleus = require("organic-nucleus")
var resolveReferences = require("organic-dna-resolvereferences")
var fold = require("organic-dna-fold")


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
    if(err) return done(null, []) // TODO, better handle missing node_modules folder per script
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

var loadModules = function(loader, dnaProperty, moduleFilter, next){
  var self = this
  findAngelScriptModules(moduleFilter, function(err, paths){
    if(err) return next(err)
    if(self.angelDNA[dnaProperty])
      self.angelDNA[dnaProperty] = self.angelDNA[dnaProperty].concat(paths)
    else
      self.angelDNA[dnaProperty] = paths
    loader.load(self.angelDNA[dnaProperty], next)
  })
}

module.exports = function(dna){
  var self = this
  var dna = dna instanceof DNA?dna:new DNA(dna)

  if(process.env.CELL_MODE)
    fold(dna, selectBranch(dna, process.env.CELL_MODE))
  resolveReferences(dna)

  if(dna.angel)
    this.angelDNA = dna.angel.index || dna.angel
  else
    this.angelDNA = dna

  var nucleus = new Nucleus(self.plasma, this.angelDNA)
  self.plasma.on("build", function(c, next){
    nucleus.build(c, next)
  })
  
  if(this.angelDNA.membrane)
    this.plasma.emit({"type": "build", branch: "membrane"})
  if(this.angelDNA.plasma)
    this.plasma.emit({"type": "build", branch: "plasma"})

  this.dna = new DNA()
  loadDir(this.dna, path.join(process.cwd(), "dna"), function(err){
    loadModules.call(self, self.abilities, "abilities", filterAbilities, function(err){
      if(err) return console.error(err)
      loadModules.call(self, self.scripts, "scripts", filterScripts, function(err){
        if(err) return console.error(err)
        process.nextTick(function(){
          self.plasma.emit({type: "ready"})    
        })  
      })
    })
  })
}