describe("Cell Organelle", function(){
  var Plasma = require("organic").Plasma;
  var plasma = new Plasma();
  var Cell = require('../../actions/Cell');
  var config = {
    cell: {
      "remote-siblings": [
        { 
          name: "1", 
          target: "~/dir", 
          remote: "test@server", 
          source: "git@github", 
          main: "test.js" 
        }
      ]
    }
  };
  var cell;

  var mockSshExec = function(code, output){
    return function(remote, insturctions, callback){
      callback({code: code, output: output, insturctions: insturctions});
    }
  }

  it("has instance", function(next){
    cell = new Cell(plasma, config);
    next();
  })
  it("installs", function(next){
    var s = config.cell["remote-siblings"][0];
    cell.sshExec = mockSshExec(0, "");
    cell.install({ target: s.name }, this, function(c){
      expect(c.code).toBe(0);
      expect(c.insturctions[0]).toContain(s.target);
      expect(c.insturctions[1]).toContain(s.target);
      expect(c.insturctions[2]).toContain(s.source);
      next();
    })
  })
  it("uninstalls", function(next){
    var s = config.cell["remote-siblings"][0];
    cell.sshExec = mockSshExec(0, "");
    cell.uninstall({ target: s.name }, this, function(c){
      expect(c.code).toBe(0);
      expect(c.insturctions[0]).toContain("rm -rf");
      expect(c.insturctions[0]).toContain(s.target);
      next();
    })
  })
  it("starts", function(next){
    var s = config.cell["remote-siblings"][0];
    cell.sshExec = mockSshExec(0, "");
    cell.start({ target: s.name }, this, function(c){
      expect(c.code).toBe(0);
      expect(c.insturctions[3]).toContain("angel Tissue start ");
      expect(c.insturctions[3]).toContain(s.main);
      next();
    })
  })
  it("stops", function(next){
    var s = config.cell["remote-siblings"][0];
    cell.sshExec = mockSshExec(0, "");
    cell.stop({ target: s.name }, this, function(c){
      expect(c.code).toBe(0);
      expect(c.insturctions[3]).toContain("angel Tissue stopall ");
      expect(c.insturctions[3]).toContain(s.main);
      next();
    })
  })
  it("restart", function(next){
    var s = config.cell["remote-siblings"][0];
    cell.sshExec = mockSshExec(0, "");
    cell.restart({ target: s.name }, this, function(c){
      expect(c.code).toBe(0);
      expect(c.insturctions[3]).toContain("angel Tissue restartall ");
      expect(c.insturctions[3]).toContain(s.main);
      next();
    })
  })
  it("upgrade", function(next){
    var s = config.cell["remote-siblings"][0];
    cell.sshExec = mockSshExec(0, "");
    cell.upgrade({ target: s.name }, this, function(c){
      expect(c.code).toBe(0);
      expect(c.insturctions[3]).toContain("angel Tissue upgradeall ");
      expect(c.insturctions[3]).toContain(s.main);
      next();
    })
  })
  it("status", function(next){
    var s = config.cell["remote-siblings"][0];
    cell.sshExec = mockSshExec(0, "");
    cell.status({ target: s.name }, this, function(c){
      expect(c.code).toBe(0);
      expect(c.insturctions[3]).toContain("angel Cell status ");
      expect(c.insturctions[3]).toContain(s.main);
      next();
    })
  })
  it('status local', function(next){
    plasma.on("Tissue", function(c, sender, callback){
      callback({data: [{name: "test.js", tissue: ""}]});
    });
    cell.status({ target: "test.js" }, this, function(c){
      expect(c.data[0].name).toBe("test.js");
      next();
    })
  })
})