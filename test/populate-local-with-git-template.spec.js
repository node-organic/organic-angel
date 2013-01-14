var Angel = require("../Angel");
var fs = require("fs");
var shelljs = require("shelljs");

describe("when using Angel class", function(){
  var instance;

  it("creates an instance", function(next){
    instance = new Angel();
    instance.plasma.on("Angel", function(c){
      expect(c instanceof Error).toBeFalsy();
      next();
    });
  });

  it("populates directory with git template", function(next){
    instance.plasma.emit({
      type: "PopulateLocal",
      target: __dirname+"/target", 
      template: "git://github.com/outbounder/php5boilerplate.git"
    }, this, function(c){
      expect(c instanceof Error).toBeFalsy();
      expect(fs.existsSync(__dirname+"/target/index.php")).toBe(true);
      shelljs.rm('-fr', __dirname+"/target");
      next();
    });
  });
});