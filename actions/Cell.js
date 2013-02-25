var organic = require("organic");
var DNA = organic.DNA;
var glob = require("glob");
var shelljs = require("shelljs");
var path = require("path");
var fs = require('fs');
var async = require('async');

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
  "printFile": function(c, sender, callback){
    fs.stat(c.target, function(err, stats){
      if (err) return callback(err);
      if(stats.size > 0)
        var readStream = fs.createReadStream(c.target, {
          start: 0,
          end: stats.size
        }).addListener("data", function(lines) {
          readStream.destroy();
          if(callback) callback({data: lines.toString(), size: stats.size});
        });
      else
        if(callback) callback({data: "", size: 0});
    });
  },
  "output": function(c, sender, callback){
    var self = this;
    this.getRemoteSibling(c.target, function(s){
      if(s) {
        self.sshExec(s.remote, [
          "cd "+s.target,
          s.npmSourceCmd || ". ~/.nvm/nvm.sh",
          s.nvmUseVersion || "nvm use "+process.version,
          "angel Cell output "+s.main
        ], callback);
      } else {
        var errorFile = c.target+".err";
        var outputFile = c.target+".out";
        async.map([errorFile, outputFile], function(file, next){
          self.printFile({target: file}, self, function(c){
            if(c instanceof Error)
              next(c)
            else
              next(null, "file "+file+" >>>\n"+c.data+"\n<<< "+file+"\n");
          });
        }, function(err, results){
          if(err) return callback(err);
          if(callback) callback({data: results.join("\n")});
        })
      }
    })
  },
  "watchFile": function(c, sender, callback){
    var startByte = 0;
    fs.stat(c.target, function(r){
      startByte = r.size || 0;
      fs.watchFile(c.target, function (curr, prev) {
        fs.stat(c.target, function(err, stats){
          if (err) return callback(err);
          if(stats.size > 0) {
            var readStream = fs.createReadStream(c.target, {
              start: startByte,
              end: stats.size
            }).addListener("data", function(lines) {
              startByte = stats.size;
              readStream.destroy();
              if(callback) callback({data: lines.toString(), size: stats.size});
            });
          }
        });
      });
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
          "angel Cell watch "+s.main
        ], callback);
      } else {
        var errorFile = c.target+".err";
        var outputFile = c.target+".out";
        [errorFile, outputFile].forEach(function(file){
          self.watchFile({target: file}, self, function(c){
            if(callback) callback(c);
          });
        });
      }
    })
  }
});
