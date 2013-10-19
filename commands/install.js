module.exports = function(plasma, config) {
  plasma.on("install", function(c, next){
    c.commands = c.commands.concat([
      "mkdir -p "+c.cell.cwd,
      "git clone "+c.cell.source+" "+c.cell.cwd,
      "cd "+c.cell.cwd,
      "git checkout "+c.cell.branch,
      c.cell.nvmSource || ". ~/.nvm/nvm.sh",
      c.cell.nodeVersion || "nvm use "+process.version,
      "npm install --production"
    ])
    next && next()
  })
}
