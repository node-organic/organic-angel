var shelljs = require("shelljs")
module.exports = function(plasma) {
  plasma.on("react", function(c, next){
    if(!c.commands) c.commands = []

    var f = function(r){
      if(r instanceof Error) return next && next(r)

      var type = c.value.shift()
      if(type) {
        c.type = type
        plasma.emit(c, f)
      } else {
        var cmd
        if(c.cell.remote)
          cmd = "ssh "+c.cell.remote+" '"+c.commands.join(" && ")+"'"
        else
          cmd = c.ommands.join(" && ")
        var child = shelljs.exec(cmd, {async: true, silent: true});
        child.stdout.pipe(process.stdout)
        child.stderr.pipe(process.stderr)
        child.on("exit", function(code){
          if(code == 0)
            next && next(c)
          else
            next && next(new Error("failed "+cmd))
        })
      }
    }
    f(c)
  })
}
