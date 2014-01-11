describe("wierd use cases", function(){
  var Angel = require("../index")
  var instance;
  it("invoke only matching by placeholder count", function(next){
    instance = new Angel(false)
    instance.plasma.on("ready", function(){
      instance.on("test :arg1 :arg2 :arg3", function(angel, next){
        next(new Error("should not happen"))
      })
      instance.on("test :arg1 :arg2 :arg3 :arg4", function(angel, next){
        next(null, angel)
      })
      instance.do("test 1 2 3 4", function(err, result){
        expect(err).toBe(null)
        next()
      })
    })
  })
})