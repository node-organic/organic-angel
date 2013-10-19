module.exports = function(plasma) {
  plasma.on("react", function(c, next){
    var f = function(c){
      if(c instanceof Error) return next && next(c)
      if(!c.commands) c.commands = []
      var type = c.value.shift()
      if(type) {
        c.type = type
        plasma.emit(c, f)
      }
    }
    f(c)
  })
}
