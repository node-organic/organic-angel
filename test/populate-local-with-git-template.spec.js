var Angel = require("../Angel");
var fs = require("fs");
var shelljs = require("shelljs");

describe("when using Angel class", function(){
  var instance;

  it("creates an instance", function(next){
    instance = new Angel();
    instance.plasma.on("ready", function(c){
      expect(c instanceof Error).toBeFalsy();
      next();
    });
  });

  it("populates directory with git template", function(next){
    instance.populateLocal(__dirname+"/target", "git://github.com/outbounder/php5boilerplate.git", function(c){
      expect(c instanceof Error).toBeFalsy();
      expect(fs.existsSync(__dirname+"/target/index.php")).toBe(true);
      shelljs.rm('-fr', __dirname+"/target");
      next();
    });
  });
});