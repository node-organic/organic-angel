describe("cli", function(){
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

  it("angel in directory with angel.json", function(next){
    process.chdir(__dirname+"/data/dir3")
    run("CELL_MODE=_staging node "+__dirname+"/../bin/angel.js", next)
  })
})