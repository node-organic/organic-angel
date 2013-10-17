var organic = require("organic");

module.exports = organic.Organel.extend(function(){
  organic.Organel.call(this, plasma, config);

  this.on("cell", function(c, next){
    var dna = new DNA();
    dna.loadDir(process.cwd()+"/dna", function(){
      if(!dna.cell) return next();
      c.cell = dna.cell;
      var parts = c.value.split(" ")
      var name = parts.shift()
      if(c.cell[name]) {
        c.cell = c.cell[name]
        c.cell.name = name
        c.value = parts.join(" ")
      }
      next && next();
    });
  })
})
