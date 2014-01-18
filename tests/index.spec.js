describe("Angel", function(){
  var Angel = require("../index")
  describe("with custom handlers", function(){
    var instance;
    beforeEach(function(next){
      instance = new Angel(false)
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
  describe("with predefined dna scripts", function(){
    var instance;
    it("constructs and starts", function(next){
      instance = new Angel({
        scripts: [__dirname+"/data/script.js"]
      })
      instance.plasma.on("ready", function(){
        instance.do("callback test", function(err, result){
          expect(result).toBe("test")
          next()
        })
      })
    })
  })
  describe("with loading scripts dynamically", function(){
    var instance;
    it("constructs and starts", function(next){
      instance = new Angel(false)
      instance.plasma.on("ready", function(){
        instance.scripts.load(__dirname, "data", function(){
          instance.do("callback test", function(err, result){
            expect(result).toBe("test")
            next()
          })  
        })
      })
    })
  })
})