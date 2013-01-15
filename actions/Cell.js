var organic = require("organic");
var DNA = organic.DNA;
var glob = require("glob");
var shelljs = require("shelljs");
var path = require("path");

var getRemoteSibling = function(target, callback){
  var dna = new DNA();
  dna.loadDir(process.cwd()+"/dna", function(){
    var mode = process.env.CELL_MODE || "development";
    if(dna[mode])
      dna.mergeBranchInRoot(mode);
    var remoteSiblings = dna.cell['remote-siblings'];
    for(var i = 0; i<remoteSiblings.length; i++)
      if(remoteSiblings[i].name == target) 
        return callback(remoteSiblings[i]);
    callback();
  });
}

var sshExec = function(remote, instructions, callback) {
  var cmd = "ssh "+remote+' "'+instructions.join(";")+'"';
  shelljs.exec(cmd, function(code, output){
    if(callback) callback({code: code, output: output});  
  });
}

module.exports = organic.Organel.extend(function Cell(plasma, config){
  organic.Organel.call(this, plasma, config);
  this.on("Cell", function(c, sender, callback){
    this[c.action](c, sender, callback);
  });
}, {
  "install": function(c, sender, callback){
    getRemoteSibling(c.target, function(s){
      sshExec(s.remote, [
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
    getRemoteSibling(c.target, function(s){
      sshExec(s.remote, ["rm -rf "+s.target], callback);
    });
  },
  "start":  function(c, sender, callback){
    getRemoteSibling(c.target, function(s){
      sshExec(s.remote, [
        "cd "+s.target,
        ". ~/.nvm/nvm.sh",
        "nvm use "+process.version,
        "angel Tissue start "+s.main
      ], callback);
    })
  },
  "stop":  function(c, sender, callback){
    getRemoteSibling(c.target, function(s){
      sshExec(s.remote, [
        "cd "+s.target,
        ". ~/.nvm/nvm.sh",
        "nvm use "+process.version,
        "angel Tissue stopall "+s.main
      ], callback);
    })
  },
  "restart": function(c, sender, callback){
    getRemoteSibling(c.target, function(s){
      sshExec(s.remote, [
        "cd "+s.target,
        ". ~/.nvm/nvm.sh",
        "nvm use "+process.version,
        "angel Tissue restartall "+s.main
      ], callback);
    })
  },
  "upgrade": function(c, sender, callback){
    getRemoteSibling(c.target, function(s){
      sshExec(s.remote, [
        "cd "+s.target,
        ". ~/.nvm/nvm.sh",
        "nvm use "+process.version,
        "angel Tissue upgradeall "+s.main
      ], callback);
    })
  }
});