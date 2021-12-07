# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## 0.6.0 - 2021-12-07

### fixed

* angel do not exit forcibly the process when entry reaction finishes
* handlers with callbacks support

## 0.5.3 - 2021-11-26

### fixed

* angel default handlers impl

## 0.5.2 - 2021-11-26

### fixed

* angel organic-plasma dep

## 0.5.1 - 2021-11-24

### fixed

* angel exception reporting

## 0.5.0 - 2021-11-19

### :warning: breaking change

* angel api is changed and any angelscripts or abilities need to upgrade:
  * angel.scripts & angel.abilities are not present, instead there is angel.loadScript(s)
  * angel.dna is not present, instead self-load dna using 3rd party utilities

### removed
* automatic dna resolution

### changed
* replaced automatic script/ability loading to package.json's (dev)dependencies sourced list instead
* rewrote the implementation with async/await

## 0.4.0 - 2019-09-17
### Added

* es6 modules import support

## 0.3.2 - 2015-12-26
### Added
- backward compatibility support for organic-angel 0.2.x
- support for `$ angel version` returning current angel instance version

## 0.3.1 - 2015-12-26
### Added
- change log :)
- `npm run release-patch` support

### Updated
- jasmine-node devDependency

## 0.3.0 - 2015-12-13
### Changed
- :warning: doesn't auto load `{cwd}/dna/` folder
- :warning: doesn't build organelles

## 0.2.x - prior 2015-12-13

## 0.1.x - prior 2013-10-17

## 0.0.x - prior 2013-02-14
