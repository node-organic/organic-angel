## Scripts and Abilities syntax

    module.exports = async function(angel) {
      angel.on(pattern, async function(angel){
      })
    }

## Angel API

### async angel.start()

1. autoloads angel modules from `process.cwd() + '/node_modules'` folder

### angel.clone()

Returns cloned object of Angel instance keeping references to:

* `angel.reactor`
* `angel.plasma`
* `angel.env.cwd`

### async angel.loadDepModules(deps, startingWith, context)

### async angel.loadScript(script, context)

### async angel.loadScripts(script, context)

### angel.on(pattern, handler)

* `pattern` : String with placeholders like 'echo :value' or RegExp
* `handler` : `async function(angel)`, where
  * `angel` : cloned Angel Object with `cmdData`
    * `cmdData` : Object containing the resulted match of `pattern`

* Returns `microApi` instance

Example:

    angel.on("tell me about :topic in :section", function(angel){
      console.log("You asked about topic:"+angel.cmdData.topic)
      console.log("And section:"+angel.cmdData.section)
    })

    // or

    angel.on(/tell me about (.*)/, function(angel){
      console.log("You asked about "+angel.cmdData[1])
    })

### angel.once(pattern, handler)

Same as `angel.on` but will handle the pattern only once.

### angel.off(microApiInstance)

`handler` won't be fired for `pattern` used in `angel.on` or `angel.once`

### async angel.do(command)

* `command` : String like 'echo test'

#### angel.addDefaultHandler(handler)

Adds a default handler, will be invoked if none handler matched given `angel.do` input command

* `handler` : async Function (input: String)