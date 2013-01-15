#!/usr/bin/env node
var util = require("util");
var Angel = require("../Angel");
var instance = new Angel();
var shelljs = require("shelljs");

instance.plasma.on("Angel", function(){
  var argv = process.argv.splice(2);
  var remote = argv.shift();
  if(remote.indexOf("@") === -1)
    actionGroup = remote;
  else
    actionGroup = argv.shift();
  var action = argv.shift();

  var chemical = {};
  chemical.type = actionGroup;
  chemical.action = action;
  chemical.remote = remote;

  if(chemical.type == "Directory" && chemical.action == "populate") {
    chemical.target = argv.shift();
    chemical.template = argv.shift();
  }

  if(chemical.type == "File" && chemical.action == "watch") {
    chemical.target = argv.shift();
  }

  if(chemical.type == "Tissue" && chemical.action == "start") {
    chemical.target = argv.shift();
    chemical.cwd = argv.shift();
  }

  if(chemical.type == "Tissue" && chemical.action == "stop") {
    chemical.target = argv.shift();
  }

  if(chemical.type == "Tissue" && chemical.action == "list") {
    chemical.target = argv.shift();
  }

  if(chemical.type == "Cell" && chemical.action == "install") {
    chemical.target = argv.shift();
    chemical.source = argv.shift();
  }

  if(chemical.type == "Cell" && chemical.action == "upgrade") {
    chemical.target = argv.shift();
    chemical.live = argv.shift();
  }

  if(chemical.type == "Cell" && chemical.action == "restart") {
    chemical.target = argv.shift();
  }

  if(chemical.type == "Cell" && chemical.action == "start") {
    chemical.target = argv.shift();
    chemical.cwd = argv.shift();
  }

  if(chemical.type == "Cell" && chemical.action == "stop") {
    chemical.target = argv.shift();
  }

  if(chemical.type == "RemoteAngel" && chemical.action == "invoke") {
    chemical.argv = argv;
  }

  instance.plasma.emit(chemical, instance, function(c){
    console.log('done ', c.data);
  })
  
});