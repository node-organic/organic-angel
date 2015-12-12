#!/usr/bin/env node
var fs = require("fs")
var path = require("path")


var argv = process.argv.splice(2)
var angelCellPath = path.join(process.cwd(), 'node_modules', 'organic-angel')
fs.exists(angelCellPath, function(found){
  if(!found) {
    angelCellPath = path.join(__dirname, '../index')
  }
  var AngelCell = require(angelCellPath)
  var angel = new AngelCell()
  angel.start(function (err) {
    if (err) {
      console.error(err)
      return process.exit(1)
    }
    angel.do(argv.join(' '), function (err) {
      if (err) {
        console.error(err)
        return process.exit(1)
      }
      process.exit(0)
    })
  })
})
