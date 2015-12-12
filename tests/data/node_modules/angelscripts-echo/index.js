module.exports = function(angel) {
  angel.on("script :data", function(angel){
    process.stdout.write(angel.cmdData.data)
  })
  angel.on("callback :data", function(angel, next){
    next(null, angel.cmdData.data)
  })
}