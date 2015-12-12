## The idea, the concepts and the domain.

### The Angel

This is an Object. It is not singleton.

Angel object has some really useful defaults:

* once the object is constructed if no configuration is passed it will try to autoload some.
* based on the boot configuration it will autoload any `node_modules` scripts and abilities available
* it will emit `autoloadReady` once all the above is done.

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
      }
    }

### The abilities

Angel abilities are functions attached to its `angel` instance. Any script can attach such
abilities without messing with other scripts, thus scripts can have different versions of the same ability. Abilities are required before scripts on boot time and all of them receive the same angel instance.

### The scripts

Angel scripts are chunks of logic which usually react on given command.
Scripts recieve a cloned angel instance on boot time and everytime when `angel.scripts.load*` methods are invoked. Further more handlers attached via `angel.on` within scripts also recieve a cloned instance of `angel`. That way any abilities are propagated from top to bottom but without messing
other handlers or scripts currently running.

### boot sequence

    $ cd ./directory
    $ angel ...
      -> try to load configuration from `angel.dnaSources`
        -> resolveReferences(dna) & fold(dna,process.env.CELL_MODE)
        -> construct Plasma & Nucleus
      -> load any `/node_modules/angelabilities`
      -> load any `/node_modules/angelscripts`
      -> react on input

#### `default dnaSources`

Angel uses the first found source for its bootstrap dna from:

* path.join(process.cwd(), "dna", "angel.json"),
* path.join(process.cwd(), "angel.json"),
* path.join(home(), "angel.json"),
* path.join(home(), "angel", "dna")

#### `existing angel scripts found in node_modules`

Angel autoloads all modules' entry points found under `cwd/node_modules` directory. That is done by iterating all top level modules having a `peerDependency` to `organic-angel` **and** named starting either with `angelscript` or `angelability`

Example name:

* `angelscripts-help`
* `angelabilities-shell`

Example `package.json` file:

    {
      "peerDependencies": {
        "organic-angel": "0.2.x"
      }
    }

<br />

### See more about organic

See [node-organic](https://github.com/VarnaLab/node-organic/tree/master/docs#organelles)
