#!/usr/bin/env node
var Angel = require("../Angel");
var instance = new Angel();
var EventEmitter = require('events').EventEmitter;

var toJSON = function(c){
  return JSON.stringify(c, function(key, value){
    if(typeof value == "object" && value instanceof EventEmitter && value.pid)
      return {pid: value.pid}
    return value
  })
}

instance.plasma.on("Angel", function(){
  var argv = process.argv.splice(2)

  var chemical = {
    type: "CommandReactor",
    value: argv.join(" ")
  }

  instance.plasma.emit(chemical, function(c){
    if(c.code) {
      process.exit(c.code)
    } else
      console.log(toJSON(c))
  })

})
