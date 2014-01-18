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

  it("angel ./dna.json", function(next){
    run("node ./bin/angel.js ./tests/data/dna.json", next)
  })

  it("angel ./dna", function(next){
    run("node ./bin/angel.js ./tests/data/dna", next)
  })

  it("angel in directory with dna/angel.json", function(next){
    process.chdir(__dirname+"/data/dir")
    run("node "+__dirname+"/../bin/angel.js", next)
  })

  it("angel in directory with angel.json", function(next){
    process.chdir(__dirname+"/data/dir2")
    run("node "+__dirname+"/../bin/angel.js", next)
  })
})