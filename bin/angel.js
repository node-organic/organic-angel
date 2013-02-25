#!/usr/bin/env node
var util = require("util");
var Angel = require("../Angel");
var instance = new Angel();
var shelljs = require("shelljs");
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var toJSON = function(c){
  return JSON.stringify(c, function(key, value){
    if(typeof value == "object" && value instanceof EventEmitter && value.pid)
      return {pid: value.pid};
    return value;
  })
}

instance.plasma.on("Angel", function(){
  var argv = process.argv.splice(2);

  var chemical = {};
  chemical.type = argv.shift();
  chemical.action = argv.shift();
  chemical.target = argv.shift();

  instance.plasma.emit(chemical, instance, function(c){
    if(c.code) {
      console.log(toJSON(c))
      process.exit(c.code);
    } if(c.data){
      if(typeof c.data == "string" && c.data.indexOf("\n") !== -1)
        console.log(c.data);
      else
        console.log(toJSON(c.data));
    } else {
      console.log(toJSON(c));
    }
      
  });
  
});