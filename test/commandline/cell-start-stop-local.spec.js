jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;

var shelljs = require("shelljs");
var fs = require('fs');

describe("command line angel", function(){
  var target = __dirname+"/../data/testCell/";
  shelljs.cd(target);
  var beforeRestart;

  it("cell starts", function(next){
    shelljs.exec("angel Cell start testCell.js", function(code, output){
      expect(code).toBe(0);
      beforeRestart = JSON.parse(output);
      expect(fs.existsSync(target+"testCell.js.out")).toBe(true);
      expect(fs.existsSync(target+"testCell.js.err")).toBe(true);
      next();
    });
  })
  it("cell status", function(next){
    shelljs.exec("angel Cell status testCell.js", function(code, output){
      expect(code).toBe(0);
      next();
    });
  })
  it("cell restart", function(next){
    shelljs.exec("angel Cell restart testCell.js", function(code, output){
      expect(code).toBe(0);
      expect(fs.existsSync(target+"testCell.js.out")).toBe(true);
      expect(fs.existsSync(target+"testCell.js.err")).toBe(true);
      expect(JSON.parse(output).data.pid).not.toBe(beforeRestart.data.pid);
      next();
    });
  })
  it("cell stops", function(next){
    shelljs.exec("angel Cell stop testCell.js", function(code, output){
      expect(code).toBe(0);
      fs.unlinkSync(target+"testCell.js.out");
      fs.unlinkSync(target+"testCell.js.err");
      next();
    });
  });
})