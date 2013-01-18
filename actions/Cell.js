var organic = require("organic");
var DNA = organic.DNA;
var glob = require("glob");
var shelljs = require("shelljs");
var path = require("path");

module.exports = organic.Organel.extend(function Cell(plasma, config){
  organic.Organel.call(this, plasma, config);
  
  if(this.config.cell)
    this.remoteSiblings = this.config.cell['remote-siblings'];

  this.on("Cell", function(c, sender, callback){
    this[c.action](c, sender, callback);
  });
}, {
  getRemoteSibling : function(target, callback){
    if(this.remoteSiblings) {
      for(var i = 0; i<this.remoteSiblings.length; i++)
        if(this.remoteSiblings[i].name == target)
          return callback(this.remoteSiblings[i]);
      callback();
    } else {
      var dna = new DNA();
      dna.loadDir(process.cwd()+"/dna", function(){
        if(!dna.cell) return callback();
        var remoteSiblings = dna.cell['remote-siblings'];
        for(var i = 0; i<remoteSiblings.length; i++)
          if(remoteSiblings[i].name == target) 
            return callback(remoteSiblings[i]);
        callback();
      });
    }
  },
  sshExec : function(remote, instructions, callback) {
    var cmd = "ssh "+remote+' "'+instructions.join(";")+'"';
    shelljs.exec(cmd, function(code, output){
      if(callback) callback({code: code, output: output});  
    });
  },
  "install": function(c, sender, callback){
    var self = this;
    this.getRemoteSibling(c.target, function(s){
      self.sshExec(s.remote, [
        "mkdir -p "+s.target,
        "cd "+s.target,
        "git clone "+s.source+" .",
        ". ~/.nvm/nvm.sh",
        "nvm use "+process.version,
        "npm install"
      ], callback);
    });
  },
  "uninstall": function(c, sender, callback) {
    var self = this;
    this.getRemoteSibling(c.target, function(s){
      self.sshExec(s.remote, ["rm -rf "+s.target], callback);
    });
  },
  "start":  function(c, sender, callback){
    var self = this;
    this.getRemoteSibling(c.target, function(s){
      if(s) {
        self.sshExec(s.remote, [
          "cd "+s.target,
          ". ~/.nvm/nvm.sh",
          "nvm use "+process.version,
          "angel Tissue start "+s.main
        ], callback);
      } else {
        self.emit({
          type: "Tissue",
          action: "start",
          target: c.target
        }, callback)
      }
    })
  },
  "stop":  function(c, sender, callback){
    var self = this;
    this.getRemoteSibling(c.target, function(s){
      if(s){
        self.sshExec(s.remote, [
          "cd "+s.target,
          ". ~/.nvm/nvm.sh",
          "nvm use "+process.version,
          "angel Tissue stopall "+s.main
        ], callback);
      } else {
        self.emit({
          type: "Tissue",
          action: "stopall", 
          target: c.target
        }, callback);
      }
    })
  },
  "restart": function(c, sender, callback){
    var self = this;
    this.getRemoteSibling(c.target, function(s){
      if(s) {
        self.sshExec(s.remote, [
          "cd "+s.target,
          ". ~/.nvm/nvm.sh",
          "nvm use "+process.version,
          "angel Tissue restartall "+s.main
        ], callback);
      } else {
        self.emit({
          type: "Tissue",
          action: "start",
          target: c.target
        }, callback)
      }
    })
  },
  "upgrade": function(c, sender, callback){
    var self = this;
    this.getRemoteSibling(c.target, function(s){
      if(s) {
        self.sshExec(s.remote, [
          "cd "+s.target,
          ". ~/.nvm/nvm.sh",
          "nvm use "+process.version,
          "angel Tissue upgradeall "+s.main
        ], callback);
      } else {
        self.emit({
          type: "Tissue",
          action: "list"
        }, function(r){
          var alive = [];
          r.data.forEach(function(entry){
            if(entry.name == c.target) {
              process.kill(-entry.pid, "SIGUSR1");
            }
          });
          if(callback) callback({data: alive});
        })
      }
    })
  },
  "status": function(c, sender, callback){
    var self = this;
    this.getRemoteSibling(c.target, function(s){
      if(s) {
        self.sshExec(s.remote, [
          "cd "+s.target,
          ". ~/.nvm/nvm.sh",
          "nvm use "+process.version,
          "angel Cell status "+s.main
        ], callback);
      } else {
        self.emit({
          type: "Tissue",
          action: "list"
        }, function(r){
          var alive = [];
          r.data.forEach(function(entry){
            if(entry.name == c.target || entry.tissue == c.target) {
              alive.push(entry);
            }
          });
          if(callback) callback({data: alive});
        })
      }
    })
  }
});