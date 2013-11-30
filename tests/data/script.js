module.exports = function(angel) {
  angel.on("script :data", function(angel, next){
    next(null, angel.cmdData.data)
  })
}