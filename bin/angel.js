#!/usr/bin/env node
var fs = require("fs")
var path = require("path")

var argv = process.argv.splice(2)
var angelCellPath = path.join(process.cwd(), 'node_modules', 'organic-angel')
fs.exists(angelCellPath, function(found){
  if(!found) {
    angelCellPath = path.join(__dirname, '../')
  }
  var AngelCell = require(angelCellPath)
  var angel = new AngelCell()
  angel.on("version", function(angel, next){
    console.log(require(path.join(angelCellPath, "/package.json")).version)
  })

  if (!angel.render) { // organic-angel 0.2.x has .render method
    angel.start(function (err) {
      if (err) {
        console.error(err.stack || err)
        return process.exit(1)
      }
      angel.do(argv.join(' '), function (err) {
        if (err) {
          console.error(err.stack || err)
          return process.exit(1)
        }
        process.exit(0)
      })
    })
  } else {  // backward compatibility with organic-angel 0.2.x
    console.info(':warning:', 'organic-angel 0.2.x is going to be depricated in 0.3.3 release')
    angel.plasma.on('ready', function () {
      angel.do(argv.join(' '), angel.render)
    })
  }
})
