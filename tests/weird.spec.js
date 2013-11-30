describe("wierd use cases", function(){
  var Angel = require("../index")
  var instance;
  it("invoke only matching by placeholder count", function(next){
    instance = new Angel()
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

  it("invoke by placeholder count with optionals", function(next){
    instance = new Angel()
    instance.plasma.on("ready", function(){
      instance.on("test :arg1 :arg2 :arg3(a|b)?", function(angel, next){
        next(new Error("should not happen"))
      })
      instance.on("test :arg1 :arg2 :arg3 :arg4(a|b)?", function(angel, next){
        next(null, angel)
      })
      instance.do("test 1 2 3", function(err, result){
        expect(err).toBe(null)
        instance.do("test 1 2 a", function(err, result){
          expect(err).toBeDefined()
          instance.do("test 1 2 3 a", function(err, result){
            expect(err).toBe(null)
            expect(result.cmdData.arg4).toBe("a")
            instance.do("test 1 2 c", function(err, result){
              expect(err).toBe(null)
              expect(result.cmdData.arg3).toBe("c")
              expect(result.cmdData.arg4).not.toBeDefined()
              next()
            })
          })
        })
      })
    })
  })
})