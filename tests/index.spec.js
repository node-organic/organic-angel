describe("Angel", function(){
  var Angel = require("../index")
  describe("with custom handlers", function(){
    var instance;
    beforeEach(function(next){
      instance = new Angel()
      next()
    })

    it("plain match", function(next){
      instance.on("first", function(angel, n){
        n(null, {data: "Test"})
      })
      instance.do("first", function(err, result){
        expect(err).toBe(null)
        expect(instance.data).not.toBeDefined()
        expect(result.data).toBe("Test")
        next()
      })
    })
    it("match with placeholder", function(next){
      instance.on("a :test", function(angel, n){
        n(null, angel)
      })
      instance.do("a test", function(err, result){
        expect(err).toBe(null)
        expect(result.cmdData.test).toBe("test")
        expect(instance.cmdData).not.toBeDefined()
        next()
      })
    })
    it("match with many placeholders", function(next){
      instance.on("c :test :test2", function(angel, n){
        n(null, angel)
      })
      instance.do("c test1 test2", function(err, result){
        expect(err).toBe(null)
        expect(result.cmdData.test).toBe("test1")
        expect(result.cmdData.test2).toBe("test2")
        next()
      })
    })
  })
  describe("with loading scripts dynamically", function(){
    var instance;
    it("constructs and starts", function(next){
      instance = new Angel()
      instance.scripts.loadScriptsByPath(__dirname+"/data/node_modules/angelscripts-echo", function(err){
        expect(err).toBeFalsy()
        instance.do("callback test", function(err, result){
          expect(err).toBeFalsy()
          expect(result).toBe("test")
          next()
        })
      })
    })
  })
})
