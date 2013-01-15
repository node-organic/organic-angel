#!/usr/bin/env node
var util = require("util");
var Angel = require("../Angel");
var instance = new Angel();
var shelljs = require("shelljs");
var util = require('util');

instance.plasma.on("Angel", function(){
  var argv = process.argv.splice(2);
  var remote = argv.shift();
  if(remote.indexOf("@") === -1) {
    actionGroup = remote;
    remote = null;
  } else
    actionGroup = argv.shift();
  var action = argv.shift();

  var chemical = {};
  chemical.type = actionGroup;
  chemical.action = action;
  chemical.remote = remote;
  chemical.target = argv.shift();

  if(chemical.type == "Directory" && chemical.action == "populate") {
    chemical.template = argv.shift();
  }

  if(chemical.type == "RemoteAngel" && chemical.action == "invoke") {
    chemical.argv = argv;
  }

  instance.plasma.emit(chemical, instance, function(c){
    if(c.code)
      process.exit(c.code);
  });
  
});