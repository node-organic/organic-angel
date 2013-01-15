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
      type: "Directory",
      action: "populate",
      remote: "node@176.58.101.229", 
      target: "~/target", 
      template: "git://github.com/outbounder/php5boilerplate.git"
    }, function(c){
      expect(c instanceof Error).toBe(false);
      var result = shelljs.exec('ssh node@176.58.101.229 "rm -rf ~/target"');
      expect(result.code).toBe(0);
      next();
    });
  });
});