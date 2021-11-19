# organic-angel v0.5.0

Angel as concept derrives from `bots`. It can be understood also as `command line assistant`.

Docs

* [Concept](/docs/concept.md)
* [API](/docs/api.md)

## example in `directory/myproject`

### 0. install organic-angel

    $ npm install organic-angel --save-dev
    $ npm install angelabilities-package-scripts --save-dev

### 1. create `./scripts/time.js` file

    module.exports = async function(angel){
      angel.on("what is the :topic", async function(angel){
        if(angel.cmdData.topic == "time")
          console.log("The time is "+(new Date()).toString())
        else
          console.error("sorry, not recognized topic " + angel.cmdData.topic)
      })
    }

<br />

### Finally at the command line

    $ npx angel what is the time


## [Abilities](https://www.npmjs.com/search?q=angelabilities)
## [Scripts](https://www.npmjs.com/search?q=angelscripts)
