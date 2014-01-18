## Angel API

### angel.dna

DNA instance, it contains boot configuration if any.

### angel.report

Reserved.

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

* `command` : String like 'echo test' or with placeholders like 'echo {value}'
* `handler` : `function(err, result)`, if not present, then `angel.do` will 
return a reaction fn, see [reactions](https://github.com/vbogdanov/reactions) for details.

### angel.render(err, data)

The default handler of angel's `do`. Override to provide different rendering of results.

### angel.loadScripts(...)
Load all scripts either by directory or by input array. 
Note that all scripts will recieve a clone of `angel` instance.

#### loadScripts(scriptsArray [, nextHandler])
* scriptsArray : Array of strings which are full paths to scripts. 
In case they are not full paths - `process.cwd()` will be prepended.
* `nextHandler` : optional `function(err)`, called once all scripts are completely loaded.

#### loadScripts(path, ... [, nextHandler])

* all arguments except the last are parts of a path to a directory
* `nextHandler` : optional `function(err)`, called once all scripts are completely loaded.