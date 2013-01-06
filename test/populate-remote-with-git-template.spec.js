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
    instance.populateRemote("node@176.58.101.229", "~/target", "git://github.com/outbounder/php5boilerplate.git", function(c){
      expect(c instanceof Error).toBeFalsy();
      var result = shelljs.exec('ssh node@176.58.101.229 "rm -rf ~/target"');
      expect(result.code).toBe(0);
      next();
    });
  });
});