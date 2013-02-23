var organic = require("organic");
var DNA = organic.DNA;
var glob = require("glob");
var shelljs = require("shelljs");
var path = require("path");
var fs = require('fs');

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
        s.npmSourceCmd || ". ~/.nvm/nvm.sh",
        s.nvmUseVersion || "nvm use "+process.version,
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
          s.npmSourceCmd || ". ~/.nvm/nvm.sh",
          s.nvmUseVersion || "nvm use "+process.version,
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
          s.npmSourceCmd || ". ~/.nvm/nvm.sh",
          s.nvmUseVersion || "nvm use "+process.version,
          "angel Tissue stopall "+s.main
        ], callback);
      } else {
        self.emit({
          type: "Tissue",
          action: "list"
        }, function(r){
          var stopped = [];
          r.data.forEach(function(entry){
            if(entry.name == c.target) {
              process.kill(entry.pid);
              stopped.push(entry);
            }
          });
          if(callback) callback({data: stopped});
        })
      }
    })
  },
  "restart": function(c, sender, callback){
    var self = this;
    this.getRemoteSibling(c.target, function(s){
      if(s) {
        self.sshExec(s.remote, [
          "cd "+s.target,
          s.npmSourceCmd || ". ~/.nvm/nvm.sh",
          s.nvmUseVersion || "nvm use "+process.version,
          "angel Tissue restartall "+s.main
        ], callback);
      } else {
        self.emit({
          type: "Tissue",
          action: "list"
        }, function(r){
          var alive = [];
          r.data.forEach(function(entry){
            if(entry.name == c.target) {
              process.kill(entry.pid, "SIGUSR2");
              alive.push(entry);
            }
          });
          if(callback) callback({data: alive});
        })
      }
    })
  },
  "upgrade": function(c, sender, callback){
    var self = this;
    this.getRemoteSibling(c.target, function(s){
      if(s) {
        self.sshExec(s.remote, [
          "cd "+s.target,
          s.npmSourceCmd || ". ~/.nvm/nvm.sh",
          s.nvmUseVersion || "nvm use "+process.version,
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
              process.kill(entry.pid, "SIGUSR1");
              alive.push(entry);
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
          s.npmSourceCmd || ". ~/.nvm/nvm.sh",
          s.nvmUseVersion || "nvm use "+process.version,
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
  },
  "printLast": function(f, callback){
    fs.stat(f, function(err, stats){
      if (err) throw err;
      if(stats.size > 0)
        var readStream = fs.createReadStream(f, {
          start: stats.size>1024?stats.size-1024:0,
          end: stats.size
        }).addListener("data", function(lines) {
          console.log(lines.toString());
          readStream.destroy();
          if(callback) callback(stats.size);
        });
      else
        if(callback) callback(stats.size);
    });
  },
  "printAndWatch": function(f){
    this.printLast(f, function(startByte){
      fs.watchFile(f, function (curr, prev) {
        fs.stat(f, function(err, stats){
          if (err) throw err;
          if(stats.size > 0)
            fs.createReadStream(f, {
              start: startByte,
              end: stats.size
            }).addListener("data", function(lines) {
              console.log(lines.toString());
              startByte = stats.size;
            });
        });
      });
    })
  },
  "output": function(c, sender, callback){
    var self = this;
    this.getRemoteSibling(c.target, function(s){
      if(s) {
        self.sshExec(s.remote, [
          "cd "+s.target,
          s.npmSourceCmd || ". ~/.nvm/nvm.sh",
          s.nvmUseVersion || "nvm use "+process.version,
          "angel Cell show-output "+s.main
        ], callback);
      } else {
        var outputFile = c.target+".out";
        if(fs.existsSync(outputFile))
          self.printLast(outputFile);
        else
          console.log(outputFile+" not found");
        var errorFile = c.target+".err";
        if(fs.existsSync(errorFile))
          self.printLast(errorFile);
        else
          console.log(errorFile+" not found");
      }
    })
  },
  "watch": function(c, sender, callback){
    var self = this;
    this.getRemoteSibling(c.target, function(s){
      if(s) {
        self.sshExec(s.remote, [
          "cd "+s.target,
          s.npmSourceCmd || ". ~/.nvm/nvm.sh",
          s.nvmUseVersion || "nvm use "+process.version,
          "angel Cell watch-output "+s.main
        ], callback);
      } else {
        var outputFile = c.target+".out";
        if(fs.existsSync(outputFile))
          self.printAndWatch(outputFile);
        else
          console.log(outputFile+" not found");
        var errorFile = c.target+".err";
        if(fs.existsSync(errorFile))
          self.printAndWatch(errorFile);
        else
          console.log(errorFile+" not found");
      }
    })
  }
});
