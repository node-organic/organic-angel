jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;

var shelljs = require("shelljs");

describe("command line angel", function(){
  shelljs.cd(__dirname+"/../data/testCell/");

  it("cell installs", function(next){
    shelljs.exec("angel Cell install staging", function(code, output){
      expect(code).toBe(0);
      next();
    });
  })
  it("cell uninstalls", function(next){
    shelljs.exec("angel Cell uninstall staging", function(code, output){
      expect(code).toBe(0);
      next();
    });
  });
})