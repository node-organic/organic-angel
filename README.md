# Angel v0.2.4

Simple as task runner, however with extra-ordinary abilities, 
`angel` is a command line assistant.

    $ angel do something
    angel> what to do? hints:
    angel> 1) check projects
    angel> 2) create project
    angel> 3) open project
    
    $ angel create project
    angel> what kind of project? hints:
    angel> 1) web
    angel> 2) mobile

    $ angel create web project
    angel> please specify technology? hints:
    angel> 1) html5/css/js
    angel> 2) nodejs+html5/css/js

    $ angel create web project with nodejs+html5/css/js
    $ angel deploy to staging && angel inspect staging

    $ angel how are you?
    angel> almost up-to-date, thanks. I see that there are new versions of some of mine components:
    * angelabilities v0.0.3
    * angelscripts v0.0.5
    Would you like to engage update? (y/n)

The above is **example** command line usage. Note that even 
the above is not ready yet, it is possible even more ;)

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

Existing scripts and abilities

* [angelabilities](http://github.com/outbounder/angelabilities)
* [angelscripts](http://github.com/outbounder/angelscripts)
* [nodeapps](http://github.com/outbounder/angelscripts-nodeapps)
* [cellcmds](http://github.com/outbounder/angelscripts-cellcmds)

## Angel API

### angel.dna

DNA instance, it contains boot configuration if any.

### angel.report

Reserved.

### angel.on(pattern, handler)

* `pattern` : String with placeholders like 'echo :value' or RegExp
* `handler` : `function(angel, next)`, where
  * `angel` : Angel Object clone
    * `cmdData` : Object containing the resulted match of `pattern`
  * `next` : `function(err, result)`

### angel.do(command [, handler])

* `command` : String like 'echo test' or with placeholders like 'echo {value}'
* `handler` : `function(err, result)`, if not present, then `angel.do` will 
return a reaction fn, see [reactions](https://github.com/vbogdanov/reactions) for details.

### angel.defaultDoHandler

The default handler of angel's `do`. Override to provide different rendering of results.

### angel.react(command)

Just executes `angel.do(command, angel.defaultDoHandler)`

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

## The idea, the concepts and the domain.

### The Angel

This is an Object. It is not singleton.

Angel object has some really funky defaults:

* once the object is constructed if no configuration is passed it will try to autoload some.
* based on the boot configuration it will autoload and autoconstruct 
  * any `organelles`
  * any `abilities` 
  * and finally any `scripts`
* it will emit `ready` once all the above is done. It will always emit that unless there is 
error found in any of the `organelles`, `abilities` or `scripts` autoloaded.

Example configuration (also called just `DNA`)

    {
      "membrane": {
        "SocketioServer": {
          "source": "node_modules/organic-socketioserver"
        }
      },
      "plasma": {
        "Logger": {
          "source": "node_modules/organic-logger"
        }
      },
      
      "abilities": [
        "/full/path/to/script",
        "relative/to/cwd/script",
        "../funky/script",
        "./another/one"
      ],
      "scripts": [
        "/same/as/abilities/paths"
      ]
    }

`membrane` and `plasma` configurations are not so often needed for cli based programs.

### The abilities

Angel abilities are functions attached to its `angel` instance. Any script can attach such
abilities without messing with other scripts, thus scripts can have different versions of the same ability. Abilities are required before scripts on boot time and all of them receive the same angel instance. 

### The scripts

Angel scripts are chunks of logic which usually react on given command.
Scripts recieve a cloned angel instance on boot time and everytime when `angel.loadScripts` is invoked. Further more handlers attached via `angel.on` within scripts also recieve a cloned instance of `angel`. That way any abilities are propagated from top to bottom but without messing 
other handlers or scripts currently running. Using any globals in scripts is forbidden by default, still core global objects are suitable to be used.

### boot sequences

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

### Organelles

See [node-organic](https://github.com/VarnaLab/node-organic/tree/master/docs#organelles)

### Differences with ...

#### Automation task runners and build tools.

Angel doesn't only runs predefined tasks, 
it is a scriptable bot which can interact with the OS and with the User.
Angel is also powerfully customizable(due `node-organic`) and tiny(283 loc).

#### irc/chat/web/commandline bots 

Angel doesn't only answers questions and plays quizes,
it can speak and do `os`, `http`, `tcp`, `commandline` tasks and
more or less to help in day-to-day development activities,
especially when scripted properly.

## example

First

    // ./time.js
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

    // ./angel.json
    {
      "scripts": [
        "./time"
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
    $ node ./node_modules/.bin/angel ./angel.json do something for time

<br />
or

    $ npm install
    $ node ./node_modules/.bin/angel do something for time    

<br />
or

    $ npm install organic-angel -g
    $ angel ./angel.json do something for time    

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

## string-template
https://github.com/Matt-Esch/string-template