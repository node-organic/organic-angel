const path = require("path")

const Plasma = require("organic-plasma")
const Reactor = require("./lib/reactor")
const esm = require('esm')

module.exports = class Angel {
  constructor() {
    this.plasma = new Plasma()
    this.reactor = new Reactor()
    this.env = {
      cwd: process.cwd()
    }
  }

  async start () {
    const packagejson = require(path.join(this.env.cwd, 'package.json'))
    const deps = Object.assign({}, packagejson.dependencies, packagejson.devDependencies)
    await this.loadDepModules(deps, 'angelabilit', this)
    await this.loadDepModules(deps, 'angelscript', this.clone())
    this.plasma.emit({ type: 'Ready' })
  }

  async loadDepModules (deps, startingWith, context = this) {
    for (let moduleName in deps) {
      if (moduleName.startsWith(startingWith)) {
        const script = path.join(this.env.cwd, 'node_modules', moduleName)
        await this.loadScript(script, context)
      }
    }
  }

  async loadScripts(scripts, context = this) {
    for(let i = 0; i<scripts.length; i++) {
      await this.loadScript(scripts[i], context)
    }
  }

  async loadScript(script, context = this) {
    const m = esm(module)(script)
    if (m.length === 2) {
      return new Promise((resolve, reject) => {
        m(context, function (err) {
          if (err) return reject(err)
          resolve()
        })
      })
    } else {
      await m(context)
    }
  }

  clone () {
    const cloned = {}
    for (const key in this) {
      cloned[key] = this[key]
    }
    let methods = ['on', 'once', 'clone', 'loadScript', 'loadScripts', 'off', 'addDefaultHandler', 'do']
    for (const m of methods) {
      cloned[m] = this[m]
    }
    return cloned
  }

  on (pattern, handler) {
    return this.reactor.on(pattern, async (cmdData) => {
      const state = this.clone()
      state.cmdData = cmdData
      if (handler.length === 2) {
        return new Promise((resolve, reject) => {
          handler(state, function (err, data) {
            if (err) return reject(err)
            resolve(data)
          })
        })
      } else {
        return handler(state)
      }
    })
  }

  once (pattern, handler) {
    return this.reactor.once(pattern, async (cmdData) => {
      const state = this.clone()
      state.cmdData = cmdData
      if (handler.length === 2) {
        return new Promise((resolve, reject) => {
          handler(state, function (err, data) {
            if (err) return reject(err)
            resolve(data)
          })
        })
      } else {
        return handler(state)
      }
    })
  }

  addDefaultHandler (handler) {
    return this.reactor.$defaultHandlers.push(handler)
  }

  off (handlerMicroApi) {
    return this.reactor.off(handlerMicroApi)
  }

  async do (input, next) {
    try {
      let r = await this.reactor.do(input)
      next && next(null, r)
      return r
    } catch (e) {
      next && next(e)
      throw e
    }
  }
}