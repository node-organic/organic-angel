describe("cli with autoloaded scripts", function(){
  var exec = require("child_process").exec

  var run = function(prefix, next) {
    exec(prefix+" script echo | cat", function (error, stdout, stderr) {
      expect(error).toBe(null)
      expect(stdout).toBe('echo')
      expect(stderr).toBe('')
      next()
    })
  }
  var cwd;
  beforeEach(function(){
    cwd = process.cwd()
  })
  afterEach(function(){
    process.chdir(cwd)
  })

  it("works", function(next){
    process.chdir(__dirname+"/data/autoload")
    run("node "+__dirname+"/../bin/angel.js", next)
  })
})