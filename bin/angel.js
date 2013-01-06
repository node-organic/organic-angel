#!/usr/bin/env node
var util = require("util");
var Angel = require("../Angel");
var instance = new Angel();
instance.plasma.on("ready", function(){
  if(process.argv[2] == "populate") { /* command */
    if(process.argv[3].indexOf("@") === -1) // local
      instance.populateLocal(process.argv[3] /* target */, process.argv[4] /* template */, function(c){
        console.log("done ", util.inspect(c));
      });
    else
      instance.populateRemote(process.argv[3] /* remote */, process.argv[4] /* target */, process.argv[5] /* template */, function(c){
        console.log("done ", util.inspect(c));
      });
  }
});