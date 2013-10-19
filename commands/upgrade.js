var shelljs = require("shelljs")
module.exports = function(plasma, config){
  plasma.on("upgrade", function(c, next){
    var args = [
      "cd "+c.cell.cwd,
      c.cell.nvmSource || ". ~/.nvm/nvm.sh",
      c.cell.nodeVersion || "nvm use "+process.version,
      "git pull origin "+c.cell.branch,
      "npm install"
    ]

    args.push("node node_modules/angel/bin/angel.js Tissue -action restart -target "+c.cell.cell)

    var child = shelljs.exec("ssh "+c.cell.remote+" '"+args.join(" && ")+"'", {async: true, silent: true});
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
