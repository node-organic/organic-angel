#!/usr/bin/env node
var util = require("util");
var Angel = require("../Angel");
var instance = new Angel();
var shelljs = require("shelljs");

instance.plasma.on("Angel", function(){
  if(process.argv[2].indexOf("@") !== -1) {
    // assuming that this is remote in format user@server
    // TODO get nvm resolver?
    var cmd = "ssh "+process.argv[2]+' ". ~/.nvm/nvm.sh; nvm use '+process.version+';angel '+
      process.argv.slice(3).join(" ")+'"';
    var child = shelljs.exec(cmd, {async:true})
    child.stdout.on('data', console.log);
    child.stderr.on('data', console.log);
    child.on('exit', function(code){
      console.log('done with code ', code);
    });
    return;
  }

  if(process.argv[2] == "cell") {
    var chemical = {};
    chemical.type = "Cell";
    if(process.argv[3].indexOf("@") === -1) {
      chemical.target = process.argv[3];
      chemical.source = process.argv[4];
    } else {
      chemical.remote = process.argv[3];
      chemical.target = process.argv[4];
      chemical.source = process.argv[5];
    }
    instance.plasma.emit(chemical, this, function(c){ // continiusly emitted
      console.log("done", util.inspect(c));
    });
  }

  if(process.argv[2] == "populate") {
    var chemical = {}
    if(process.argv[3].indexOf("@") === -1) {
      chemical.type = "PopulateLocal";
      chemical.target = process.argv[3];
      chemical.template = process.argv[4];
    } else {
      chemical.type = "PopulateRemote";
      chemical.remote = process.argv[3];
      chemical.target = process.argv[4];
      chemical.template = process.argv[5];
    }
    instance.plasma.emit(chemical, this, function(c){
      console.log("done ", util.inspect(c));
    })
  }

  if(process.argv[2] == "start") {
    instance.plasma.emit({
      type: "Tissue",
      action: "start",
      target: process.argv[3]
    }, this, function(c){
      console.log("started ", util.inspect(c.target), c.data.pid);
    })
  }

  if(process.argv[2] == "stop") {
    instance.plasma.emit({
      type: "Tissue",
      action: "stop",
      target: process.argv[3]
    }, this, function(c){
      console.log("stopped ", util.inspect(c.target));
    })
  }

  if(process.argv[2] == "upgrade") {
    process.kill(process.argv[3], "SIGUSR1");
    console.log("upgraded"); // how to get the new pid fast ?
  }

  if(process.argv[2] == "restart") {
    process.kill(process.argv[3], "SIGUSR2");
    console.log("restarted"); // how to get the new pid fast ?
  }

  if(process.argv[2] == "list") {
    instance.plasma.emit({
      type: "Tissue",
      action: "list",
      target: process.argv[3]
    }, this, function(c){
      console.log(util.inspect(c.data));
    })
  }

  if(process.argv[2] == "watch") {
    console.log("watching", process.argv[3]);
    instance.plasma.emit({
      type: "LocalFile",
      action: "watch",
      target: process.argv[3]
    }, this, function(c){ // continiusly emitted
      console.log(c.data);
    });
  }
});