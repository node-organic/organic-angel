describe("angel.on with regex", function(){
  it("invokes properly", function(next){
    var Angel = require("../index")
    var instance = new Angel()
    instance.on(/test me/, function(angel, next){
      expect(angel.cmdData).toBeDefined()
      next(null, angel)
    })
    instance.do("test me", function(err, result){
      expect(err).toBeFalsy()
      expect(result.cmdData[0]).toBe("test me")
      next()
    })
  })
})