#!/usr/bin/env node
var Angel = require("../Angel");

if(!module.parent) {
  var instance = new Angel();
  instance.plasma.on("ready", function(){
    var argv = process.argv.splice(2)
    instance.do(argv.join(" "), function(err, result){
      if(err) {
        console.error(err)
        return process.exit(1)
      }
      if(result && result.stdout && result.stderr && result.on) {
        result.stdout.pipe(process.stdout)
        result.stderr.pipe(process.stderr)
        result.on("close", function(code){
          process.exit(code)
        })
      }
      if(result.data)
        process.stdout.write(JSON.stringify(result.data))
    })
  })
}
