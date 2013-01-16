var shelljs = require("shelljs");
describe("angel with custom organelles", function(){
  it("calls the custom organelle", function(next){
    shelljs.cd(__dirname+"/../data/testCell");
    shelljs.exec("angel TestCell doSomething", function(code, output){
      expect(code).toBe(0);
      expect(output).toContain("Hello");
      next();
    });
  })
})