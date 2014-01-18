#!/usr/bin/env node
var fs = require("fs")
var path = require("path")
var Angel = require("../index");

if(!module.parent) {
  var argv = process.argv.splice(2)
  fs.exists(path.join(process.cwd(), argv[0]), function(found){
    var instance
    if(found)
      instance = new Angel(argv.shift())
    else
      instance = new Angel()
    instance.plasma.on("ready", function(){
      instance.do(argv.join(" "), instance.render)
    })
  })
}
