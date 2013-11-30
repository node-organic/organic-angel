describe("Angel", function(){
  var Angel = require("../index")
  describe("with custom handlers", function(){
    var instance;
    beforeEach(function(next){
      instance = new Angel()
      instance.plasma.on("ready", function(){
        next()
      })
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
    it("match with placeholder with a pattern", function(next){
      instance.on("b :test(one|two)", function(angel, n){
        n(null, angel)
      })
      instance.do("b three", function(err){ expect(err).toBeDefined() })
      instance.do("b one", function(err, result){
        expect(err).toBe(null)
        expect(result.cmdData.test).toBe("one")
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
    it("match with many placeholders with patterns", function(next){
      instance.on("d :test :test2 :test3(one|two)", function(angel, n){
        n(null, angel)
      })
      instance.do("d test1 test2 test3", function(err){ expect(err).toBeDefined() })
      instance.do("d test1 test2 two", function(err, result){
        expect(err).toBe(null)
        expect(result.cmdData.test).toBe("test1")
        expect(result.cmdData.test2).toBe("test2")
        expect(result.cmdData.test3).toBe("two")
        next()
      })
    })
    it("match with optional placeholders", function(next){
      instance.on("f :test? :test2?", function(angel, n){
        n(null, angel)
      })
      instance.do("f a1 a2", function(err, result){
        expect(err).toBe(null)
        expect(result.cmdData['test']).toBe("a1")
        expect(result.cmdData['test2']).toBe("a2")
        instance.do("f a1", function(err, result){
          expect(err).toBe(null)
          expect(result.cmdData['test']).toBe("a1")
          expect(result.cmdData['test2']).not.toBeDefined()
          next()  
        })  
      })
    })
  })
  describe("with predefined dna scripts", function(){
    var instance;
    it("constructs and starts", function(next){
      instance = new Angel({
        scripts: [__dirname+"/data/script.js"]
      })
      instance.plasma.on("ready", function(){
        instance.do("script test", function(err, result){
          expect(result).toBe("test")
          next()
        })
      })
    })
  })
  describe("with loading scripts dynamically", function(){
    var instance;
    it("constructs and starts", function(next){
      instance = new Angel()
      instance.plasma.on("ready", function(){
        instance.scripts.load(__dirname, "data", function(){
          instance.do("script test", function(err, result){
            expect(result).toBe("test")
            next()
          })  
        })
      })
    })
  })
})