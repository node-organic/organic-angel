module.exports = function(plasma, config){
  plasma.on("start", function(c, next){
    c.commands = c.commands.concat([
      "cd "+c.cell.cwd,
      c.cell.nvmSource || ". ~/.nvm/nvm.sh",
      c.cell.nodeVersion || "nvm use "+process.version,
      "node node_modules/organic-angel/bin/angel.js Tissue -action start -target "+c.cell.target
    ])
    next && next()
  })
}
