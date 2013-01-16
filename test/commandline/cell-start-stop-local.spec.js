jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;

var shelljs = require("shelljs");

describe("command line angel", function(){
  shelljs.cd(__dirname+"/../data/testCell/");

  it("cell starts", function(next){
    shelljs.exec("angel Cell start testCell.js", function(code, output){
      expect(code).toBe(0);
      next();
    });
  })
  it("cell status", function(next){
    shelljs.exec("angel Cell status testCell.js", function(code, output){
      expect(code).toBe(0);
      next();
    });
  })
  it("cell stops", function(next){
    shelljs.exec("angel Cell stop testCell.js", function(code, output){
      expect(code).toBe(0);
      next();
    });
  });
})