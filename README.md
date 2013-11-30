# Angel v0.2.2

Simple as task runner, however with extra-ordinary abilities, 
`angel` is a command line assistant.

    $ angel do something

The above is command line usage. Angel similar to 
[hubot](http://hubot.github.com/) can load several 
scripts/scenarious/modules and/or plugins which all
react to the process' command line arguments and to 
stdin via build-in reactor.


## Scripts and Abilities syntax

    module.exports = function(angel [, next]) {
      // next is optional, if the scripts needs async loading.
      angel.on("hi", function(options [, next]){
        console.log("Hello there")
        // possibly call next(/* Error, Result optional */)
      })
    }
<br />

There are various scripts already - use the code ;)

* [nodeapps](http://github.com/outbounder/angelscripts-nodeapps)
* [cellcmds](http://github.com/outbounder/angelscripts-cellcmds)
* [angelscripts](http://github.com/outbounder/angelscripts)

## Angel API

### angel.cmdData

Available only when angel is used within `angel.on` handler.

### angel.dna

DNA instance, it contains boot configuration

### angel.report

### angel.loadScripts

### angel.on(pattern, handler)

* `pattern` : String with placeholders , like 'echo :value'
* `handler` : `function(angel, next)`, where
  * `angel` : Object containg the placeholder's values within `cmdData` property
  * `next` : `function(err, result)` to be executed next with arguments

### angel.do(command [, handler])

* `command` : String, like 'echo test' or with placeholders like 'echo {value}'
* `handler` : `function(err, result)`, if not present, then `angel.do` will 
return a reaction fn, see [reactions](https://github.com/vbogdanov/reactions) for details.

### angel.defaultDoHandler

### angel.react(command)


### angel.loadScripts(path, innerPath [, nextHandler])

* all arguments except the last are parts of a path which is joined.
* `nextHandler` : `function(err)`, called once all scripts are completely loaded.

## boot sequences

    $ angel ./path/to/angel.json ...
      -> Load given angel.json as root dna
      -> merge `index.json` to root dna
      -> construct dna.plasma
      -> construct dna.membrane
      -> load `dna.abilities`
      -> load `dna.scripts`
      -> react ...
<br />

    $ angel ./path/to/angel/dir/ ...
      -> Load all `.json` files recusively
      -> use dna.angel or just dna as root configuration
      -> merge `index.json` to root dna
      -> construct dna.plasma
      -> construct dna.membrane
      -> load `dna.abilities`
      -> load `dna.scripts`
      -> react ...
<br />

    $ cd ./directory
    $ angel ...
      -> try to load `./angel.json` if not 
        -> try to load all `.json` files recursively in `./dna`
        -> use dna.angel or just dna as root configuration
        -> merge `index.json` to root dna
      -> construct dna.plsma
      -> construct dna.memberne
      -> load `dna.abilities`
      -> load `dna.scripts`
      -> react ...
<br />

## Organelles

See [node-organic](https://github.com/VarnaLab/node-organic/tree/master/docs#organelles)

## Differences with ...

### Automation task runners and build tools.

Angel doesn't only runs predefined tasks, 
it is a scriptable bot which can interact with the OS and with the User.
Angel is also powerfully customizable(due `node-organic`) and tiny(265 loc).

### irc/chat/web/commandline bots 

Angel doesn't only answers questions and plays quizes,
it can speak and do os, http, tcp, commandline tasks and
more or less to help in day-to-day development activities,
especially when scripted properly.

## example

First

    // ./script.js
    module.exports = function(angel){
      angel.on("do something for :topic", function(angel, next){
        if(angel.cmdData.topic == "time")
          console.log("The time is "+(new Date()).toString())
        else
          console.error("sorry")
      })
    }

<br />
Second

    // ./dna/angel.json
    {
      "scripts": [
        "./script"
      ]
    }

<br />
Third

    // ./package.json
    {
      "dependencies": {
        "organic-angel": "0.2.0"
      }
    }

<br />
Finally at the command line

    $ npm install
    $ node ./node_modules/.bin/angel ./dna/angel.json do something for time

<br />
or

    $ npm install organic-angel -g
    $ angel ./dna/angel.json do something for time    

<br />
or

    $ npm install organic-angel -g
    $ angel do something for time


# Thanks to

## organic
https://github.com/varnalab/node-organic

## underscore
http://underscorejs.org

## async
https://github.com/caolan/async

## npm
http://npmjs.org

## string-template
https://github.com/Matt-Esch/string-template