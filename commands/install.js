var shelljs = require("shelljs")

module.exports = function(plasma, config) {
  plasma.on("install", function(c, next){
    var args = [
      "mkdir -p "+c.cell.cwd,
      "git clone "+c.cell.source+" "+c.cell.cwd,
      "git checkout "+c.cell.branch,
      "cd "+c.cell.cwd,
      c.cell.nvmSource || ". ~/.nvm/nvm.sh",
      c.cell.nodeVersion || "nvm use "+process.version,
      "npm install --production"
    ].join(" && ")
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
