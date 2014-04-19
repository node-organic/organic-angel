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

    $ angel <path> ...
      -> Load given path as root dna
      -> use dna.angel or just dna as root configuration
      -> merge `index.json` to root dna
      -> resolveReferences(dna)
      -> construct dna.plasma
      -> construct dna.membrane
      -> load `dna.abilities`
      -> load `dna.scripts`
      -> react on ...
<br />

    $ cd ./directory
    $ angel ...
      -> try to load configuration from `sources`
      -> use dna.angel or just dna as root configuration
      -> merge `index.json` to root dna
      -> resolveReferences(dna)
      -> construct dna.plsma
      -> construct dna.memberne
      -> load `dna.abilities`
      -> load `dna.scripts`
      -> react on ...

#### `default sources`

  * path.join(process.cwd(), "dna"),
  * path.join(process.cwd(), "angel.json"), 
  * path.join(home(), "angel.json"),
  * path.join(home(), "angel", "dna")
  
<br />

### Organelles

See [node-organic](https://github.com/VarnaLab/node-organic/tree/master/docs#organelles)