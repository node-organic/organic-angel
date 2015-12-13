var repl = require("repl")

module.exports = function(angel) {
  angel.on("start chat", function(){
    repl.start({}).context.angel = angel
  })
}