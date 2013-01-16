# Angel #
Single cell and command line application for doing handy of helpful things for everyday routines.

## Features ##

* can start/stop processes in background
* can list running organic processes who form Tissues (see `organic-cells`)
* can restart and/or upgrade organic processes who has Self (see `organic-cells`)

## Command line usage ##

    $ angel Cell start <app.js || siblingName>
Will start app.js or any remote sibling, output and error log files wull be stored at `cwd`\<app.js>.out and `cwd`\<app.js>.err
    
    $ angel Cell status <app.js || siblingName>
Will list any processes using Tissue's algorithm (see `organic-cells`)

    $ angel Cell stop <app.js || siblingName>
Will stop any process with given local pid, or app.js main or any remote sibling

    $ angel Cell restart <app.js || siblingName>
Will send `SIGUSR2` to process with given pid (see `organic-cells`)

    $ angel Cell upgrade <app.js || siblingName>
Will send `SIGUSR1` to process with given pid (see `organic-cells`)

## Remote Siblings ##

Stored in `cwd`/dna/cell.json within `remote-siblings` property as array of entries:

    {
      "name": "staging",
      "remote": "node@XXX.XX.XXX.XXX",
      "target": "~/testCell",
      "main": "testCell.js",
      "source": "https://github.com/outbounder/organic-angel.git"
    }
    
## Runtime organells and actions ##

Angel is mixing its DNA with the contents of `cwd`/dna/angel.json upon boot, therefore using `node-organic` Organelles 
one can provide additional actions within context specific for the current project/directory.
