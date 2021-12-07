#!/usr/bin/env node
const fs = require("fs")
const path = require("path")

const argv = process.argv.splice(2)
let angelCellPath = path.join(process.cwd(), 'node_modules', 'organic-angel')

process.on('unhandledRejection', (err) => {
  console.log('unhandledRejection', err)
  process.exit(1)
})

fs.exists(angelCellPath, async function(found){
  if(!found) {
    angelCellPath = path.join(__dirname, '../')
  }
  const AngelCell = require(angelCellPath)
  const angelInstance = new AngelCell()
  angelInstance.on("version", function(angel){
    console.log(require(path.join(angelCellPath, "/package.json")).version)
  })
  try {
    await angelInstance.start()
  } catch (err) {
    console.error(err.stack || err)
    return process.exit(1)
  }
  try {
    await angelInstance.do(argv.join(' '))
  } catch (err) {
    console.error(err.stack || err)
    return process.exit(1)
  }
})
