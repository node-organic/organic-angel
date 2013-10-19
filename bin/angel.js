#!/usr/bin/env node
var Angel = require("../Angel");
var EventEmitter = require('events').EventEmitter;

var toJSON = module.exports.toJSON = function(c){
  return JSON.stringify(c, function(key, value){
    if(typeof value == "object" && value instanceof EventEmitter && value.pid)
      return {pid: value.pid}
    return value
  })
}

var constructChemical = module.exports.constructChemical = function(argv) {
  var chemical = {
    type: argv.shift(),
    value: []
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
  instance.plasma.on("Angel", function(){
    var argv = process.argv.splice(2)
    var chemical = constructChemical(argv)
    instance.plasma.emit(chemical, function(c){
      if(c instanceof Error)
        console.error(c.stack)
      else
      if(c && typeof c.code != "undefined")
        process.exit(c.code)
      else
        console.log(c)
    })

  })
}
