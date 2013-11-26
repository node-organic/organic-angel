module.exports = function(angel) {
  angel.on("script :data", function(options, next){
    next(null, options.data)
  })
}