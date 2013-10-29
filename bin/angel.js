#!/usr/bin/env node
var Angel = require("../Angel");
var ChildProcess = require("child_process").ChildProcess

var constructChemical = module.exports.constructChemical = function(argv) {
  var chemical = {
    type: argv.shift(),
    value: [],
    stdout: process.stdout,
    stderr: process.stderr
  }
  var memoKey = null
  for(var i = 0; i<argv.length; i++) {
    if(argv[i].indexOf("-") == 0) {
      memoKey = argv[i].substr(1)
      continue
    }
    if(memoKey) {
      if(!chemical[memoKey])
        chemical[memoKey] = []
      chemical[memoKey].push(argv[i])
    } else {
      chemical.value.push(argv[i])
    }
  }
  return chemical
}



if(!module.parent) {
  var instance = new Angel();
  instance.plasma.on("ready", function(){
    var argv = process.argv.splice(2)
    var chemical = constructChemical(argv)
    instance.plasma.emit(chemical, function(c){
      if(c.pid && c.stdout && c.stderr) {
        c.stdout.pipe(process.stdout)
        c.stderr.pipe(process.stderr)
        c.on("close", function(code){
          if(code != 0)
            console.error("failed ", chemical)
        })
      } else
      if(c instanceof Error)
        console.error(c.stack)
      else
        console.log(c)
    })
  })
}
