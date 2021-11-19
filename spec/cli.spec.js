describe("angel via cli", function(){
  var exec = require("child_process").exec

  var cwd;
  beforeEach(function(){
    cwd = process.cwd()
  })
  afterEach(function(){
    process.chdir(cwd)
  })

  it("executes and autoload echo script", function(next){
    process.chdir(__dirname+"/data")
    exec("node ../../bin/angel.js script echo", function (error, stdout, stderr) {
      expect(error).toBe(null)
      expect(stdout).toBe('echo')
      expect(stderr).toBe('')
      next()
    })
  })
  it("executes and autoload chat script", function(next){
    process.chdir(__dirname+"/data")
    var child = exec("node ../../bin/angel.js start chat")
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
