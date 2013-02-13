jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;

var shelljs = require("shelljs");

xdescribe("command line angel", function(){
  shelljs.cd(__dirname+"/../data/testCell/");

  it("cell registers", function(next){
    shelljs.exec("angel Service register testCell.js", function(code, output){
      expect(code).toBe(0);
      next();
    });
  })
  it("cell unregisters", function(next){
    shelljs.exec("angel Service unregister testCell.js", function(code, output){
      expect(code).toBe(0);
      next();
    });
  });
})