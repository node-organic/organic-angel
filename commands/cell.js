var DNA = require("organic").DNA;

module.exports = function(plasma) {
  plasma.on("cell", function(c, next){
    var dna = new DNA();
    dna.loadDir(process.cwd()+"/dna", function(){
      var name = c.value.shift()
      c.cell = dna.cell
      if(c.cell[name]) {
        c.cell = c.cell[name]
        next && next()
      } else
        next && next(new Error(name+" cell not found in dna/cell"))
    });
  })
}
