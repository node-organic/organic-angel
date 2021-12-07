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
    child.stderr.on('data', console.error)
    child.stdout.on("data", function(chunk){
      chunk = chunk.toString()
      if(state == 0) {
        child.stdin.write("angel.do('script hi', console.log)\n")
        state = 1
        return
      }
      if(state == 1) {
        expect(chunk).toContain('hi')
        child.stdin.end()
        state = 2
      }
    })
    child.on('exit', function (code) {
      if (code !== 0) return next(new Error('should not happen'))
      if (state !== 2) return next(new Error('didnt reached hi state'))
      next()
    })
    child.on("error", next)
  })
})
