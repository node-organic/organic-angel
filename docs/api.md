## Scripts and Abilities syntax

    module.exports = function(angel [, next]) {
      // next is optional, if async loading is needed.
      angel.on(pattern, function(angel [, next]){
        // possibly call next(/* Error, Result optional */)
      })
    }

## Angel API

### angel.dna

DNA instance, it contains boot configuration if any related to Angel itself

#### angel DNA source list

* path.join(process.cwd(), "dna", "angel.json"),
* path.join(process.cwd(), "angel.json"),
* path.join(home(), "angel.json"),
* path.join(home(), "angel", "dna")

### angel.on(pattern, handler)

* `pattern` : String with placeholders like 'echo :value' or RegExp
* `handler` : `function(angel, next)`, where
  * `angel` : cloned Angel Object with `cmdData`
    * `cmdData` : Object containing the resulted match of `pattern`
  * `next` : optional `function(err, result)`

Example:

    angel.on("tell me about :topic in :section", function(angel){
      console.log("You asked about topic:"+angel.cmdData.topic)
      console.log("And section:"+angel.cmdData.section)
    })

    // or

    angel.on(/tell me about (.*)/, function(angel){
      console.log("You asked about "+angel.cmdData[1])
    })


### angel.do(command [, handler])

* `command` : String like 'echo test'
* `handler` : `function(err, result)`


### angel.loadScripts(scriptsArray [, nextHandler])
Note that all scripts recieve a clone of `angel` instance.

* `scriptsArray` : Array of strings which are paths to scripts.
* `nextHandler` : optional `function(err)`, called once all scripts are loaded.

#### loadScriptsByPath(directoryPath [, nextHandler])
Note that all scripts recieve a clone of `angel` instance.

* `directoryPath` : path to a directory containing `.js` files to be loaded as scripts
* `nextHandler` : optional `function(err)`, called once all scripts are loaded.

#### loadScript(scriptPath, nextHandler)
Note that scripts recieve a clone of `angel` instance.

Load script at given path using the following detect array:

* scriptPath,
* path.join(process.cwd(), scriptPath),
* path.join(process.cwd(), "node_modules", scriptPath),
* path.join(home(), "angel_modules", scriptPath),
* path.join(home(), "angel_modules", "node_modules", scriptPath)
