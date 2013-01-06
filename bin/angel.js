#!/usr/bin/env node
var util = require("util");
var Angel = require("../Angel");
var instance = new Angel();
instance.plasma.on("ready", function(){
  if(process.argv[2] == "populate") { /* command */
    instance.populate(process.argv[3] /* target */, process.argv[4] /* template */, function(c){
      console.log("done ", util.inspect(c));
    });
  }
});