# Angel v0.3.1

Angel derrives as concept from `bots`, like [hubot](http://hubot.github.com/).
However it is for command line. It can be understood also as `command line assistant`.

Docs

* [Concept](/docs/concept.md)
* [API](/docs/api.md)
* [Roadmap](/docs/future.md)


Existing abilities
* [package-scripts](https://github.com/outbounder/angelabilities-package-scripts)


Existing scripts
* [help](http://github.com/outbounder/angelscripts-help)
* [cellcmds](http://github.com/outbounder/angelscripts-cellcmds)

## example in `directory/myproject`

### 0. install organic-angel

    $ npm install organic-angel --save-dev

### 1. install package-scripts ability

    $ npm install angelabilities-package-scripts --save-dev

### 2. create `./scripts/time.js` file

    module.exports = function(angel){
      angel.on("what is the :topic", function(angel, next){
        if(angel.cmdData.topic == "time")
          console.log("The time is "+(new Date()).toString())
        else
          console.error("sorry, not recognized topic " + angel.cmdData.topic)
      })
    }

<br />

### Finally at the command line

    $ node ./node_modules/.bin/angel what is the time

or if you have angel global installed (`$ npm install organic-angel -g`)

    $ angel what is the time
