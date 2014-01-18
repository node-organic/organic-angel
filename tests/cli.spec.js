describe("angel via cli", function(){
  var exec = require("child_process").exec

  it("executes based on custom dna", function(next){
    exec("node ./bin/angel.js ./tests/data/dna.json script echo", function (error, stdout, stderr) {
      expect(error).toBe(null)
      expect(stdout).toBe('echo')
      expect(stderr).toBe('')
      next()
    })
  })
  it("executes in readline mode", function(next){
    var child = exec("node ./bin/angel.js ./tests/data/dna.json start chat")
    var state = 0
    child.stdout.on("data", function(chunk){
      if(state == 0) {
        expect(chunk.toString()).toBe("> ")
        child.stdin.write("angel.do('script hi', console.log)\n")
        state = 1
      } 
      if(state == 1) {
        if(chunk.toString() == "> ") return
        expect(chunk.toString()).toBe('hi')
        child.stdin.end()
        state = 2
        next()
      }
    })
    child.on("error", next)
  })
})