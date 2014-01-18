# Angel v0.2.8

Simple as task runner, however with extra-ordinary abilities, 
`angel` is a command line assistant.

Angel is derrives as concept from `bots`, like [hubot](http://hubot.github.com/). 
However it is for command line. It can be mapped also as `the command line assistant`.

## Scripts and Abilities syntax

    module.exports = function(angel [, next]) {
      // next is optional, if async loading is needed.
      angel.on(pattern, function(angel [, next]){
        // possibly call next(/* Error, Result optional */)
      })
    }
<br />

Docs

* [Concept](/docs/concept.md)
* [API](/docs/api.md)
* [Roadmap](/docs/future.md)


Existing scripts and abilities

* [angelabilities](http://github.com/outbounder/angelabilities)
* [angelscripts](http://github.com/outbounder/angelscripts)
* [nodeapps](http://github.com/outbounder/angelscripts-nodeapps)
* [cellcmds](http://github.com/outbounder/angelscripts-cellcmds)
* [generate](https://github.com/outbounder/angelscripts-generate)

## example in `directory/myproject`

### 1. create `./time.js` file 

    module.exports = function(angel){
      angel.on("do something for :topic", function(angel, next){
        if(angel.cmdData.topic == "time")
          console.log("The time is "+(new Date()).toString())
        else
          console.error("sorry")
      })
    }

<br />
### 2. create `./angel.json` file

    {
      "scripts": [
        "./time.js"
      ]
    }

<br />
### 3. create `./package.json` file

    {
      "dependencies": {
        "organic-angel": "0.2.8"
      }
    }

<br />
### Finally at the command line

    $ npm install organic-angel -g
    $ angel do something for time

# Thanks to

## organic
https://github.com/varnalab/node-organic

## underscore
http://underscorejs.org

## async
https://github.com/caolan/async

## string-template
https://github.com/Matt-Esch/string-template

## home-dir
https://github.com/scottcorgan/home-dir