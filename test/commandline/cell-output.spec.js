jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;

var shelljs = require("shelljs");
var fs = require("fs");

describe("angel Cell output", function(){
  var target = __dirname+"/../data/testCell/";
  shelljs.cd(target);

  it("should return the whole output", function(next){
    shelljs.exec("angel Cell start testCell.js", function(code, output){
      expect(code).toBe(0);
      expect(fs.existsSync(target+"testCell.js.out")).toBe(true);
      expect(fs.existsSync(target+"testCell.js.err")).toBe(true);
    });
    setTimeout(function(){
      shelljs.exec("angel Cell output testCell.js", function(code, output){
        expect(code).toBe(0);
        expect(output.length > 0).toBe(true);
        fs.unlink(target+"testCell.js.out")
        fs.unlink(target+"testCell.js.err")
        next();
      });
    }, 1000);
  })
})