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

  it("populates directory with local template files", function(next){
    instance.populateLocal(__dirname+"/target", __dirname+"/data/nodejs-template", function(c){
      expect(c instanceof Error).toBeFalsy();
      var packagejson = JSON.parse(fs.readFileSync(__dirname+"/target/package.json").toString());
      expect(packagejson.name).toBe("target");
      expect(fs.existsSync(__dirname+"/target/target.js")).toBe(true);
      expect(fs.existsSync(__dirname+"/target/bin/target.js")).toBe(true);
      var targetjs = fs.readFileSync(__dirname+"/target/target.js").toString();
      expect(targetjs).toContain("module.exports = function target()");
      shelljs.rm('-fr', __dirname+"/target");
      next();
    });
  });

  it("populates directory with local template files and preseeded data", function(next){
    instance.populateLocal(__dirname+"/target", __dirname+"/data/nodejs-template", {
      name: "TestTarget"
    },function(c){
      expect(c instanceof Error).toBeFalsy();
      var packagejson = JSON.parse(fs.readFileSync(__dirname+"/target/package.json").toString());
      expect(packagejson.name).toBe("TestTarget");
      expect(fs.existsSync(__dirname+"/target/TestTarget.js")).toBe(true);
      expect(fs.existsSync(__dirname+"/target/bin/TestTarget.js")).toBe(true);
      var targetjs = fs.readFileSync(__dirname+"/target/TestTarget.js").toString();
      expect(targetjs).toContain("module.exports = function TestTarget()");
      shelljs.rm('-fr', __dirname+"/target");
      next();
    });
  });
})