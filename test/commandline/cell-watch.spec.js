jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;

var shelljs = require("shelljs");
var fs = require("fs");

describe("angel Cell watch", function(){
  var target = __dirname+"/../data/testCell/";
  shelljs.cd(target);

  it("should watch output of a cell", function(next){
    var child = shelljs.exec("angel Cell watch testCell.js", {async: true});
    setTimeout(function(){
      shelljs.exec("angel Cell start testCell.js", function(code, output){
        expect(code).toBe(0);
        expect(fs.existsSync(target+"testCell.js.out")).toBe(true);
        expect(fs.existsSync(target+"testCell.js.err")).toBe(true);
        setTimeout(function(){
          child.kill();
          fs.unlink(target+"testCell.js.out")
          fs.unlink(target+"testCell.js.err")
          next();
        }, 4000);
      });
    }, 2000);
  })
})