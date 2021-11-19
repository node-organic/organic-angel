## The idea, the concepts and the domain.

### The Angel

This is an Object. It is not singleton.

Angel object has some really useful defaults:

* it will autoload angelabilities and angelscripts based on listed (dev)dependencies in `process.cwd() + '/package.json'`
* it will emit `Ready` once all the above is done.


### The abilities

Angel abilities features attached the `angel` instance. Abilities are required before scripts on boot time and all of them receive the same angel instance.

### The scripts

Angel scripts are usually command handlers. Scripts recieve a cloned angel instance on boot time and everytime when `angel.load*` methods are invoked.

### boot sequence

    $ cd ./directory
    $ angel ...
      -> parse ./package.json and extract list of scripts and abilities
      -> load defined abilities from `/node_modules/angelabilities*`
      -> load defined scripts from `/node_modules/angelscripts*`
      -> react on input

### See more about organic

See [node-organic](https://github.com/node-organic/node-organic)
