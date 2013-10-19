var shelljs = require("shelljs")

module.exports = function(plasma, config) {
  plasma.on("uninstall", function(c, next){
    var args = "rm -rf "+c.cell.cwd
    var child = shelljs.exec("ssh "+c.cell.remote+" '"+args+"'", {async: true, silent: true});
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
    child.on("exit", function(code){
      if(code == 0)
        next && next(c)
      else
        next && next(new Error("failed "+args))
    })
  })
}
