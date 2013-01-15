#!/usr/bin/env node
var util = require("util");
var Angel = require("../Angel");
var instance = new Angel();
var shelljs = require("shelljs");
var util = require('util');

instance.plasma.on("Angel", function(){
  var argv = process.argv.splice(2);

  var chemical = {};
  chemical.type = argv.shift();
  chemical.action = argv.shift();
  chemical.target = argv.shift();

  instance.plasma.emit(chemical, instance, function(c){
    if(c.code)
      process.exit(c.code);
    else
      console.log(util.inspect(c));
  });
  
});